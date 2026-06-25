from __future__ import annotations

import argparse
import json
import os
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


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument(
        "--roots",
        nargs="*",
        default=None,
        help="Explicit agent roots to scan. Defaults to ~/.codex ~/.claude ~/.qwenpaw.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help=(
            "Output JSON path. Defaults to "
            "$AI_TRACE_SCAN_OUTPUT or ~/.ai-trace/data/registry/agent_candidates.json. "
            "Use 'mock' to write to mock/data/registry/ in the repo."
        ),
    )
    parser.add_argument(
        "--mock",
        action="store_true",
        default=False,
        help="Write output to mock/data/registry/ instead of the private data root.",
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


def collect_workspace_hints(root: Path) -> tuple[set[str], int, str | None]:
    workspaces: set[str] = set()
    session_count = 0
    session_index_path: str | None = None

    name = root.name.lstrip(".")
    is_codex = name == "codex" or (root / "session_index.jsonl").exists()
    is_claude = name == "claude" or (root / "history.jsonl").exists() and ((root / "CLAUDE.md").exists() or (root / "sessions").exists())
    is_antigravity = name == "antigravity" or name == "antigravity-ide" or (root / "conversations").exists()
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
                    chats_json = child / "chats.json"
                    if chats_json.exists():
                        try:
                            chats_data = json.loads(chats_json.read_text(encoding="utf-8"))
                            if isinstance(chats_data, list):
                                session_count += len(chats_data)
                            elif isinstance(chats_data, dict):
                                session_count += len(chats_data)
                        except Exception:
                            pass
            return workspaces, session_count, str(workspaces_dir)

    known_dirs = ["workspaces", "projects", "repos", "sessions"]
    for dirname in known_dirs:
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


def scan_root(root: Path) -> AgentCandidate | None:
    if not root.exists():
        return None

    workspaces, session_count, session_index_path = collect_workspace_hints(root)
    markers = detect_markers(root)
    mode = infer_workspace_mode(workspaces, root)
    source_type = infer_session_source_type(root, session_index_path, workspaces)
    sorted_workspaces = sorted(workspaces)

    selected_workspace = sorted_workspaces[0] if sorted_workspaces else None
    selected_workspace_masked = mask_private_path(selected_workspace) if selected_workspace else None

    return AgentCandidate(
        candidate_id=f"candidate-{normalize_agent_id(root)}",
        agent_id=normalize_agent_id(root),
        product=infer_product(root),
        suggested_alias=infer_product(root),
        root_path=str(root),
        root_path_masked=mask_private_path(str(root)) or str(root),
        status="candidate",
        workspace_mode=mode,
        session_source_type=source_type,
        session_count=session_count,
        workspace_count=len(workspaces),
        session_index_path=session_index_path,
        detected_markers=markers,
        sample_workspaces=sorted_workspaces[:5],
        sample_workspaces_masked=[mask_private_path(item) or item for item in sorted_workspaces[:5]],
        selected_workspace=selected_workspace,
        selected_workspace_masked=selected_workspace_masked,
        notes="",
    )


def default_output_path() -> Path:
    """默认输出到私有仓 data/registry 目录，可通过环境变量或 --output 覆盖。"""
    value = os.environ.get("AI_TRACE_SCAN_OUTPUT")
    if value:
        return Path(value).expanduser()
    return Path("~/.ai-trace/data/registry/agent_candidates.json").expanduser()


def mock_output_path() -> Path:
    """Mock 模式输出路径：公开仓内的 mock/data，可随代码一起提交。"""
    repo_root = Path(__file__).parent.parent.parent.parent
    return repo_root / "mock" / "data" / "registry" / "agent_candidates.json"


def write_output(candidates: list[AgentCandidate], output_path: Path) -> None:
    """将扫描结果写入指定路径（单一目标，不自动复制）。"""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": utc_now(),
        "count": len(candidates),
        "candidates": [asdict(item) for item in candidates],
    }
    content = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    output_path.write_text(content, encoding="utf-8")


def run_scan(args: argparse.Namespace) -> None:
    roots = expand_roots(args.roots)
    candidates = [item for item in (scan_root(root) for root in roots) if item is not None]

    if args.output:
        output_path = Path(args.output).expanduser()
    elif getattr(args, "mock", False):
        output_path = mock_output_path()
    else:
        output_path = default_output_path()

    write_output(candidates, output_path)
    print(f"Scanned {len(candidates)} agent roots -> {output_path}")
    print("Tip: run with --mock to write to mock/data/registry/ for frontend preview.")
