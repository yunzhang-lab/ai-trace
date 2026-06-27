from __future__ import annotations

import argparse
import json
import os
import re
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


DEFAULT_ROOTS = [
    "~/.codex",
    "~/.claude",
    "~/.qwenpaw",
    "~/.gemini/antigravity-ide",
]


@dataclass
class AgentCandidate:
    candidate_id: str
    agent_id: str
    agent_root: str
    product: str
    suggested_alias: str
    root_path: str
    root_path_masked: str
    status: str
    workspace_mode: str
    session_source_type: str
    session_count: int
    workspace_count: int
    session_index_path: str | None
    detected_markers: list[str]
    sample_workspaces: list[str]
    sample_workspaces_masked: list[str]
    selected_workspace: str | None
    selected_workspace_masked: str | None
    notes: str
    scanned_at: str


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument(
        "--roots",
        nargs="*",
        default=None,
        help="Explicit agent roots to scan. Defaults to ~/.codex ~/.claude ~/.qwenpaw ~/.gemini/antigravity-ide.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help=(
            "Output JSON path. Defaults to "
            "$AI_TRACE_SCAN_OUTPUT or ~/.ai-trace/data/registry/agent_candidates.json. "
            "Use 'mock' to write to skill/ai-trace/mock/data/registry/."
        ),
    )
    parser.add_argument(
        "--mock",
        action="store_true",
        default=False,
        help="Write output to skill/ai-trace/mock/data/registry/ instead of the private data root.",
    )
    return parser


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def expand_roots(raw_roots: list[str] | None) -> list[Path]:
    values = raw_roots or DEFAULT_ROOTS
    return [Path(value).expanduser() for value in values]


def load_jsonl(path: Path, limit: int = 200) -> list[dict]:
    rows: list[dict] = []
    if not path.exists():
        return rows
    with path.open("r", encoding="utf-8") as handle:
        for index, line in enumerate(handle):
            if index >= limit:
                break
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return rows


def count_qwenpaw_workspace_sessions(workspace_dir: Path) -> int:
    chats_json = workspace_dir / "chats.json"
    if not chats_json.exists():
        return 0
    try:
        chats_data = json.loads(chats_json.read_text(encoding="utf-8"))
    except Exception:
        return 0
    if isinstance(chats_data, list):
        return len(chats_data)
    if isinstance(chats_data, dict):
        return len(chats_data)
    return 0


def collect_workspace_hints(root: Path) -> tuple[set[str], int, str | None]:
    workspaces: set[str] = set()
    session_count = 0
    session_index_path: str | None = None

    name = root.name.lstrip(".")
    is_codex = name == "codex" or (root / "session_index.jsonl").exists()
    is_claude = name == "claude" or (
        (root / "history.jsonl").exists() and ((root / "CLAUDE.md").exists() or (root / "sessions").exists())
    )
    is_antigravity = name in {"antigravity", "antigravity-ide"} or (root / "conversations").exists()
    is_qwenpaw = name == "qwenpaw" or (root / "workspaces").exists()

    if is_codex:
        idx_path = root / "session_index.jsonl"
        if idx_path.exists():
            rows = load_jsonl(idx_path, limit=1000)
            session_count = len(rows)
            for row in rows:
                cwd = row.get("cwd")
                if isinstance(cwd, str) and cwd.strip():
                    workspaces.add(cwd.strip())
            session_index_path = str(idx_path)
            return workspaces, session_count, session_index_path

    if is_claude:
        hist_path = root / "history.jsonl"
        if hist_path.exists():
            rows = load_jsonl(hist_path, limit=5000)
            session_ids = set()
            for row in rows:
                sid = row.get("sessionId")
                if sid:
                    session_ids.add(sid)
                proj = row.get("project")
                if isinstance(proj, str) and proj.strip():
                    workspaces.add(proj.strip())
            session_count = len(session_ids)
            return workspaces, session_count, str(hist_path)

    if is_antigravity:
        conv_dir = root / "conversations"
        if conv_dir.exists():
            pb_files = [f for f in conv_dir.iterdir() if f.is_file() and f.name.endswith(".pb")]
            session_count = len(pb_files)

        brain_dir = root / "brain"
        if brain_dir.exists():
            for child in brain_dir.iterdir():
                if not child.is_dir() or child.name == "tempmediaStorage":
                    continue
                trans_path = child / ".system_generated" / "logs" / "transcript.jsonl"
                if trans_path.exists():
                    rows = load_jsonl(trans_path, limit=2)
                    if rows:
                        content = rows[0].get("content", "")
                        if "<ADDITIONAL_METADATA>" in content:
                            try:
                                meta_part = content.split("<ADDITIONAL_METADATA>")[1].split("</ADDITIONAL_METADATA>")[0].strip()
                                meta_json = json.loads(meta_part)
                                cwd = meta_json.get("cwd")
                                if cwd:
                                    workspaces.add(cwd)
                            except Exception:
                                pass
            if not session_count:
                session_count = len([d for d in brain_dir.iterdir() if d.is_dir() and d.name != "tempmediaStorage"])
            return workspaces, session_count, str(conv_dir) if conv_dir.exists() else None

    if is_qwenpaw:
        workspaces_dir = root / "workspaces"
        if workspaces_dir.exists():
            for child in workspaces_dir.iterdir():
                if child.is_dir():
                    workspaces.add(str(child))
                    session_count += count_qwenpaw_workspace_sessions(child)
            return workspaces, session_count, str(workspaces_dir)

    for dirname in ["workspaces", "projects", "repos", "sessions"]:
        path = root / dirname
        if not path.exists() or not path.is_dir():
            continue
        for child in path.iterdir():
            if child.is_dir():
                workspaces.add(str(child))

    return workspaces, session_count, None


def detect_markers(root: Path) -> list[str]:
    markers: list[str] = []
    checks = {
        "session_index.jsonl": root / "session_index.jsonl",
        "sessions/": root / "sessions",
        "config.toml": root / "config.toml",
        "AGENTS.md": root / "AGENTS.md",
        "CLAUDE.md": root / "CLAUDE.md",
        "conversations/": root / "conversations",
        "brain/": root / "brain",
        "config.json": root / "config.json",
        "workspaces/": root / "workspaces",
        "history.jsonl": root / "history.jsonl",
    }
    for name, path in checks.items():
        if path.exists():
            markers.append(name)
    return markers


def mask_private_path(value: str | None) -> str | None:
    if value is None:
        return None
    home = str(Path.home())
    if value.startswith(home):
        return value.replace(home, "~", 1)
    return value


def infer_workspace_mode(workspaces: Iterable[str], root: Path) -> str:
    unique = {item for item in workspaces if item}
    if len(unique) > 1:
        return "multi-space"
    if len(unique) == 1:
        return "single-space"
    if (root / "sessions").exists():
        return "single-space"
    return "unknown"


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "instance"


def normalize_agent_id(root: Path) -> str:
    name = root.name.lstrip(".").replace("_", "-")
    if name == "antigravity-ide":
        return "antigravity"
    return name or "agent"


def infer_product(root: Path) -> str:
    name = root.name.lstrip(".")
    aliases = {
        "codex": "Codex",
        "claude": "Claude Code",
        "qwenpaw": "QwenPaw",
        "antigravity-ide": "Antigravity",
        "antigravity": "Antigravity",
    }
    return aliases.get(name, name.title())


def infer_session_source_type(root: Path, session_index_path: str | None, workspaces: set[str]) -> str:
    if session_index_path:
        source_name = Path(session_index_path).name
        if source_name in {"workspaces", "projects"}:
            return "workspace_dir"
        if source_name in {"sessions", "conversations"}:
            return "session_dir"
        return "session_index"
    if (root / "sessions").exists():
        return "session_dir"
    if workspaces:
        return "workspace_dir"
    return "unknown"


def infer_top_space(value: str | None) -> tuple[str, str] | None:
    if not value:
        return None
    home = Path.home().resolve()
    path = Path(value).expanduser().resolve()
    try:
        rel = path.relative_to(home)
    except Exception:
        masked = mask_private_path(str(path)) or str(path)
        return str(path), masked

    if len(rel.parts) == 0:
        return None

    first = rel.parts[0]
    if first.startswith('.'):
        return None

    top_private = home / first
    top_masked = mask_private_path(str(top_private)) or str(top_private)
    return str(top_private), top_masked


def default_space_metadata(path_masked: str) -> dict:
    if path_masked == "~/Projects":
        return {
            "purpose": "工程项目根目录",
            "purpose_tag": "工程",
            "visibility": "all",
            "status": "declared",
        }
    if path_masked == "~/Documents":
        return {
            "purpose": "文档与资料存储",
            "purpose_tag": "文档",
            "visibility": "all",
            "status": "declared",
        }
    if path_masked.startswith("~/."):
        return {
            "purpose": "Agent 或系统配置目录",
            "purpose_tag": "配置",
            "visibility": "all",
            "status": "declared",
        }
    return {
        "purpose": "",
        "purpose_tag": "未声明",
        "visibility": "none",
        "status": "undeclared",
    }


def build_root_candidate(root: Path, scanned_at: str) -> AgentCandidate | None:
    if not root.exists():
        return None

    workspaces, session_count, session_index_path = collect_workspace_hints(root)
    markers = detect_markers(root)
    source_type = infer_session_source_type(root, session_index_path, workspaces)
    product = infer_product(root)
    root_path = str(root)
    root_path_masked = mask_private_path(root_path) or root_path

    # Phase 2 当前只有显式多实例产品才按 workspace 拆分。
    # 对于 Claude / Codex / Antigravity 这类单实例产品，注册主键直接等于根目录。
    mode = "single-space"
    selected_workspace = root_path
    selected_workspace_masked = root_path_masked
    workspace_count = 1
    sample_workspaces = [root_path]
    sample_workspaces_masked = [root_path_masked]

    return AgentCandidate(
        candidate_id=f"candidate-{normalize_agent_id(root)}",
        agent_id=normalize_agent_id(root),
        agent_root=product,
        product=product,
        suggested_alias=product,
        root_path=root_path,
        root_path_masked=root_path_masked,
        status="candidate",
        workspace_mode=mode,
        session_source_type=source_type,
        session_count=session_count,
        workspace_count=workspace_count,
        session_index_path=session_index_path,
        detected_markers=markers,
        sample_workspaces=sample_workspaces,
        sample_workspaces_masked=sample_workspaces_masked,
        selected_workspace=selected_workspace,
        selected_workspace_masked=selected_workspace_masked,
        notes="",
        scanned_at=scanned_at,
    )


def build_qwenpaw_instance_candidates(root: Path, scanned_at: str) -> list[AgentCandidate]:
    workspaces_dir = root / "workspaces"
    if not workspaces_dir.exists() or not workspaces_dir.is_dir():
        fallback = build_root_candidate(root, scanned_at)
        return [fallback] if fallback else []

    candidates: list[AgentCandidate] = []
    markers = detect_markers(root)
    product = infer_product(root)
    base_id = normalize_agent_id(root)

    for child in sorted(workspaces_dir.iterdir(), key=lambda p: p.name.lower()):
        if not child.is_dir():
            continue
        instance_name = child.name
        instance_slug = slugify(instance_name)
        session_count = count_qwenpaw_workspace_sessions(child)
        selected_workspace = str(child)
        session_index_path = str(child / "chats.json") if (child / "chats.json").exists() else str(child)
        instance_label = f"{product} / {instance_name}"
        candidates.append(
            AgentCandidate(
                candidate_id=f"candidate-{base_id}-{instance_slug}",
                agent_id=f"{base_id}-{instance_slug}",
                agent_root=instance_label,
                product=product,
                suggested_alias=instance_label,
                root_path=str(root),
                root_path_masked=mask_private_path(str(root)) or str(root),
                status="candidate",
                workspace_mode="single-space",
                session_source_type="workspace_dir",
                session_count=session_count,
                workspace_count=1,
                session_index_path=session_index_path,
                detected_markers=markers,
                sample_workspaces=[selected_workspace],
                sample_workspaces_masked=[mask_private_path(selected_workspace) or selected_workspace],
                selected_workspace=selected_workspace,
                selected_workspace_masked=mask_private_path(selected_workspace) or selected_workspace,
                notes="",
                scanned_at=scanned_at,
            )
        )

    return candidates


def scan_root(root: Path, scanned_at: str) -> list[AgentCandidate]:
    if not root.exists():
        return []
    if normalize_agent_id(root) == "qwenpaw" and (root / "workspaces").exists():
        return build_qwenpaw_instance_candidates(root, scanned_at)
    candidate = build_root_candidate(root, scanned_at)
    return [candidate] if candidate else []


def default_output_path() -> Path:
    value = os.environ.get("AI_TRACE_SCAN_OUTPUT")
    if value:
        return Path(value).expanduser()
    return Path("~/.ai-trace/data/registry/agent_candidates.json").expanduser()


def mock_output_path() -> Path:
    skill_root = Path(__file__).resolve().parents[2]
    return skill_root / "mock" / "data" / "registry" / "agent_candidates.json"


def serialize_candidate(candidate: AgentCandidate, is_mock: bool) -> dict:
    payload = asdict(candidate)
    if is_mock:
        payload.pop("root_path", None)
        payload.pop("session_index_path", None)
        payload.pop("sample_workspaces", None)
        payload.pop("selected_workspace", None)
    return payload


def generate_workspace_candidates(candidates: list[AgentCandidate], is_mock: bool = False) -> list[dict]:
    workspaces: list[dict] = []
    seen: set[tuple[str, str]] = set()
    for candidate in candidates:
        options = candidate.sample_workspaces or ([candidate.selected_workspace] if candidate.selected_workspace else [])
        for index, workspace in enumerate(options):
            if not workspace:
                continue
            key = (candidate.agent_id, workspace)
            if key in seen:
                continue
            seen.add(key)
            workspaces.append(
                {
                    "workspace_id": f"workspace-{slugify(candidate.agent_id)}-{index}",
                    "candidate_id": candidate.candidate_id,
                    "agent_id": candidate.agent_id,
                    "workspace_name": Path(workspace).name or candidate.product,
                    "workspace_path_private": None if is_mock else workspace,
                    "workspace_path_masked": mask_private_path(workspace) or workspace,
                    "status": "candidate",
                    "detected_markers": candidate.detected_markers,
                }
            )
    return workspaces


def load_existing_spaces(path: Path) -> dict[str, dict]:
    if not path.exists():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}
    spaces = payload.get("spaces", []) if isinstance(payload, dict) else []
    existing: dict[str, dict] = {}
    for item in spaces:
        key = item.get("path_masked") or item.get("space_id")
        if key:
            existing[key] = item
    return existing


def build_space_entry(masked_path: str, private_path: str, previous: dict, defaults: dict, last_scan: str, is_mock: bool) -> dict:
    return {
        "space_id": previous.get("space_id") or f"space-{slugify(masked_path)}",
        "path": previous.get("path") or (masked_path if is_mock else private_path),
        "path_masked": masked_path,
        "purpose": previous.get("purpose", defaults["purpose"]),
        "purpose_tag": previous.get("purpose_tag", defaults["purpose_tag"]),
        "visibility": previous.get("visibility", defaults["visibility"]),
        "status": previous.get("status", defaults["status"]),
        "agent_ids": [],
        "last_scan": previous.get("last_scan") or last_scan,
    }


def build_mock_spaces_payload(candidates: list[AgentCandidate], spaces_path: Path) -> dict:
    existing = load_existing_spaces(spaces_path)
    aggregated: dict[str, dict] = {}

    for candidate in candidates:
        raw_paths = [candidate.root_path, *candidate.sample_workspaces]
        for raw_path in raw_paths:
            top_space = infer_top_space(raw_path)
            if top_space is None:
                continue
            private_path, masked_path = top_space
            if masked_path not in aggregated:
                defaults = default_space_metadata(masked_path)
                previous = existing.get(masked_path, {})
                aggregated[masked_path] = build_space_entry(masked_path, private_path, previous, defaults, candidate.scanned_at, True)
            entry = aggregated[masked_path]
            if candidate.agent_id not in entry["agent_ids"]:
                entry["agent_ids"].append(candidate.agent_id)
            entry["last_scan"] = max(entry["last_scan"], candidate.scanned_at)

    spaces = []
    for masked_path in sorted(aggregated):
        entry = aggregated[masked_path]
        entry["agent_ids"] = sorted(entry["agent_ids"])
        entry["agent_count"] = len(entry["agent_ids"])
        spaces.append(entry)

    return {
        "generated_at": utc_now(),
        "count": len(spaces),
        "spaces": spaces,
    }


def iter_home_top_level_dirs(home: Path) -> list[Path]:
    dirs: list[Path] = []
    if not home.exists():
        return dirs
    for child in sorted(home.iterdir(), key=lambda item: item.name.lower()):
        if not child.is_dir() or child.name.startswith('.'):
            continue
        dirs.append(child)
    return dirs


def is_preservable_existing_space(private_path: str | None) -> bool:
    if not private_path:
        return False
    home = Path.home().resolve()
    try:
        rel = Path(private_path).expanduser().resolve().relative_to(home)
    except Exception:
        return False
    if len(rel.parts) < 2:
        return False
    if rel.parts[0].startswith('.'):
        return False
    return True


def belongs_to_space(path_value: str | None, space_private_path: str) -> bool:
    if not path_value:
        return False
    try:
        base = Path(space_private_path).expanduser().resolve()
        value = Path(path_value).expanduser().resolve()
        value.relative_to(base)
        return True
    except Exception:
        return False


def generate_spaces_payload(candidates: list[AgentCandidate], spaces_path: Path, is_mock: bool = False) -> dict:
    if is_mock:
        return build_mock_spaces_payload(candidates, spaces_path)

    existing = load_existing_spaces(spaces_path)
    home = Path.home().resolve()
    scanned_at = max([candidate.scanned_at for candidate in candidates], default=utc_now())
    aggregated: dict[str, dict] = {}

    for child in iter_home_top_level_dirs(home):
        private_path = str(child)
        masked_path = mask_private_path(private_path) or private_path
        defaults = default_space_metadata(masked_path)
        previous = existing.get(masked_path, {})
        aggregated[masked_path] = build_space_entry(masked_path, private_path, previous, defaults, scanned_at, False)

    for previous in existing.values():
        private_path = previous.get('path')
        masked_path = previous.get('path_masked')
        if not private_path or not masked_path or masked_path in aggregated:
            continue
        if not is_preservable_existing_space(private_path):
            continue
        defaults = default_space_metadata(masked_path)
        aggregated[masked_path] = build_space_entry(masked_path, private_path, previous, defaults, scanned_at, False)

    for entry in aggregated.values():
        for candidate in candidates:
            candidate_paths = [candidate.root_path, candidate.selected_workspace, *candidate.sample_workspaces]
            if any(belongs_to_space(raw_path, entry['path']) for raw_path in candidate_paths if raw_path):
                if candidate.agent_id not in entry['agent_ids']:
                    entry['agent_ids'].append(candidate.agent_id)
                entry['last_scan'] = max(entry['last_scan'], candidate.scanned_at)

    spaces = []
    for masked_path in sorted(aggregated):
        entry = aggregated[masked_path]
        entry['agent_ids'] = sorted(entry['agent_ids'])
        entry['agent_count'] = len(entry['agent_ids'])
        spaces.append(entry)

    return {
        'generated_at': utc_now(),
        'count': len(spaces),
        'spaces': spaces,
    }


def write_json(path: Path, data: dict | list) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    content = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    path.write_text(content, encoding="utf-8")



def write_output(candidates: list[AgentCandidate], output_path: Path, is_mock: bool = False) -> None:
    agents_payload = {
        "generated_at": utc_now(),
        "count": len(candidates),
        "candidates": [serialize_candidate(item, is_mock) for item in candidates],
    }
    workspaces_payload = generate_workspace_candidates(candidates, is_mock)
    spaces_path = output_path.parent / "spaces.json"
    spaces_payload = generate_spaces_payload(candidates, spaces_path, is_mock)

    write_json(output_path, agents_payload)
    write_json(output_path.parent / "workspace_candidates.json", workspaces_payload)
    write_json(spaces_path, spaces_payload)


def run_scan(args: argparse.Namespace) -> None:
    scanned_at = utc_now()
    roots = expand_roots(args.roots)
    candidates: list[AgentCandidate] = []
    for root in roots:
        candidates.extend(scan_root(root, scanned_at))

    is_mock = getattr(args, "mock", False)
    if args.output:
        output_path = Path(args.output).expanduser()
    elif is_mock:
        output_path = mock_output_path()
    else:
        output_path = default_output_path()

    write_output(candidates, output_path, is_mock)
    print(f"Scanned {len(candidates)} agent candidates -> {output_path}")
    print("Tip: run with --mock to write to skill/ai-trace/mock/data/registry/ for frontend preview.")
