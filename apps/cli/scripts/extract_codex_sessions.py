from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from typing import Any


UUID_PATTERN = re.compile(
    r"([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})",
    re.IGNORECASE,
)
PRIVATE_PATH_PATTERN = re.compile(r"/Users/[^ \n\r\t\"']+")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Export sanitized Codex session index data for ai-trace-open."
    )
    parser.add_argument(
        "--codex-root",
        default=os.environ.get("AI_TRACE_CODEX_ROOT", str(Path.home() / ".codex")),
        help="Private Codex workspace root. Default: $AI_TRACE_CODEX_ROOT or ~/.codex",
    )
    parser.add_argument(
        "--output",
        default=os.environ.get(
            "AI_TRACE_CODEX_EXPORT",
            str(Path(__file__).resolve().parents[2] / "dashboard/js/data/codex-data.js"),
        ),
        help="Output JS file path for the public dashboard.",
    )
    parser.add_argument(
        "--public-only",
        action="store_true",
        default=True,
        help="Export only sanitized public-safe fields.",
    )
    return parser


def normalize_private_path(value: str) -> str:
    if not value:
        return ""
    if value.startswith("~"):
        return "<private-path>"
    if PRIVATE_PATH_PATTERN.search(value):
        return PRIVATE_PATH_PATTERN.sub("<private-path>", value)
    return value


def sanitize_text(value: str) -> str:
    if not value:
        return ""
    value = PRIVATE_PATH_PATTERN.sub("<private-path>", value)
    value = value.replace("~/.codex", "<private-path>")
    value = value.replace("~/.ai-trace", "<private-path>")
    return value


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    if not path.exists():
        return items
    with path.open("r", encoding="utf-8") as handle:
        for raw_line in handle:
            line = raw_line.strip()
            if not line:
                continue
            try:
                items.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return items


def build_rollout_map(sessions_dir: Path) -> dict[str, dict[str, str]]:
    rollout_map: dict[str, dict[str, str]] = {}
    if not sessions_dir.exists():
        return rollout_map
    for file_path in sessions_dir.rglob("*rollout*.jsonl"):
        match = UUID_PATTERN.search(file_path.name)
        if not match:
            continue
        session_id = match.group(1)
        rollout_map[session_id] = {
            "folder_path": normalize_private_path(str(file_path.parent)),
            "rollout_file": file_path.name,
            "full_path": str(file_path),
        }
    return rollout_map


def extract_messages(rollout_file: Path, public_only: bool) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = []
    for item in read_jsonl(rollout_file):
        item_type = item.get("type")
        payload = item.get("payload", {}) if isinstance(item.get("payload", {}), dict) else {}

        if item_type == "session_meta":
            continue

        if item_type != "response_item":
            continue

        role = payload.get("role")
        if role not in ("user", "assistant"):
            continue

        text_parts: list[str] = []
        for content_item in payload.get("content", []) or []:
            if not isinstance(content_item, dict):
                continue
            if content_item.get("type") in ("input_text", "output_text"):
                text_parts.append(str(content_item.get("text", "")))

        msg_text = "\n".join(text_parts)
        if public_only:
            msg_text = sanitize_text(msg_text)
        if len(msg_text) > 3000:
            msg_text = msg_text[:3000] + "\n... [已截断，可在私有原始日志中查看详情] ..."

        messages.append(
            {
                "role": role,
                "text": msg_text,
                "timestamp": str(item.get("timestamp", "")),
            }
        )

    return messages


def export_sessions(codex_root: Path, output_path: Path, public_only: bool = True) -> int:
    index_path = codex_root / "session_index.jsonl"
    sessions_dir = codex_root / "sessions"

    sessions: list[dict[str, Any]] = []
    index_rows = read_jsonl(index_path)
    rollout_map = build_rollout_map(sessions_dir)

    for row in index_rows:
        session_id = row.get("id")
        if not session_id:
            continue

        session: dict[str, Any] = {
            "id": session_id,
            "thread_name": sanitize_text(str(row.get("thread_name", ""))) if public_only else str(row.get("thread_name", "")),
            "updated_at": str(row.get("updated_at", "")),
            "source_scope": "private workspace",
            "cwd": "",
            "folder_path": "",
            "rollout_file": "",
            "messages": [],
        }

        rollout_info = rollout_map.get(str(session_id))
        if rollout_info:
            session["folder_path"] = rollout_info["folder_path"]
            session["rollout_file"] = rollout_info["rollout_file"]
            rollout_file = Path(rollout_info["full_path"])

            try:
                with rollout_file.open("r", encoding="utf-8") as handle:
                    for raw_line in handle:
                        line = raw_line.strip()
                        if not line:
                            continue
                        try:
                            data = json.loads(line)
                        except json.JSONDecodeError:
                            continue

                        if data.get("type") == "session_meta":
                            cwd = data.get("payload", {}).get("cwd", "")
                            session["cwd"] = normalize_private_path(str(cwd))
                            continue

                session["messages"] = extract_messages(rollout_file, public_only=public_only)
            except OSError:
                continue

        sessions.append(session)

    write_js_data(sessions, output_path)
    return len(sessions)


def write_js_data(sessions: list[dict[str, Any]], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    js_content = (
        "// This file is auto-generated by apps/cli/scripts/extract_codex_sessions.py.\n"
        "// It contains only sanitized public-safe data.\n"
        f"const codexSessionsData = {json.dumps(sessions, indent=2, ensure_ascii=False)};\n"
    )
    output_path.write_text(js_content, encoding="utf-8")


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    codex_root = Path(args.codex_root).expanduser()
    output_path = Path(args.output).expanduser()
    count = export_sessions(codex_root, output_path, public_only=args.public_only)
    print(f"Successfully exported {count} sessions to {output_path}")


if __name__ == "__main__":
    main()
