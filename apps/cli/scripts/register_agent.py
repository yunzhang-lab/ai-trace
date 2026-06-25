from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument(
        "--candidate-id",
        required=True,
        help="The candidate ID to register (e.g., candidate-codex).",
    )
    parser.add_argument(
        "--alias",
        default=None,
        help="Optional custom alias for the registered agent.",
    )
    parser.add_argument(
        "--candidates-file",
        default=None,
        help="Path to candidates file. Defaults to ~/.ai-trace/data/registry/agent_candidates.json",
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help="Directory to store registered agent cards. Defaults to ~/.ai-trace/data/agents/",
    )
    return parser


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def run_register(args: argparse.Namespace) -> None:
    # 1. Resolve paths
    candidates_path = (
        Path(args.candidates_file).expanduser()
        if args.candidates_file
        else Path("~/.ai-trace/data/registry/agent_candidates.json").expanduser()
    )
    output_dir = (
        Path(args.output_dir).expanduser()
        if args.output_dir
        else Path("~/.ai-trace/data/agents").expanduser()
    )

    if not candidates_path.exists():
        print(f"Error: Candidates file does not exist at: {candidates_path}")
        return

    # 2. Read candidates
    try:
        data = json.loads(candidates_path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"Error reading candidates file: {e}")
        return

    candidates = data.get("candidates", [])
    target = None
    for item in candidates:
        if item.get("candidate_id") == args.candidate_id:
            target = item
            break

    if not target:
        print(f"Error: Candidate with ID '{args.candidate_id}' not found.")
        print("Available candidates:")
        for item in candidates:
            print(f" - {item.get('candidate_id')} ({item.get('product')})")
        return

    # 3. Create Agent Card
    agent_id = target.get("agent_id")
    product = target.get("product")
    alias = args.alias or target.get("suggested_alias") or product
    timestamp = utc_now()

    selected_workspace = target.get("selected_workspace")
    selected_workspace_masked = target.get("selected_workspace_masked")
    if not selected_workspace_masked:
        sample_workspaces = target.get("sample_workspaces") or []
        sample_workspaces_masked = target.get("sample_workspaces_masked") or []
        if selected_workspace in sample_workspaces:
            selected_workspace_masked = sample_workspaces_masked[sample_workspaces.index(selected_workspace)]
        elif sample_workspaces_masked:
            selected_workspace_masked = sample_workspaces_masked[0]

    agent_card = {
        "agent_id": agent_id,
        "candidate_id": target.get("candidate_id"),
        "product": product,
        "alias": alias,
        "workspace_mode": target.get("workspace_mode"),
        "selected_workspace": selected_workspace,
        "selected_workspace_masked": selected_workspace_masked,
        "root_path_private": target.get("root_path"),
        "root_path_masked": target.get("root_path_masked"),
        "session_source_type": target.get("session_source_type"),
        "session_index_path": target.get("session_index_path"),
        "session_count": target.get("session_count", 0),
        "workspace_count": target.get("workspace_count", 0),
        "notes": "",
        "status": "registered",
        "detected_markers": target.get("detected_markers", []),
        "created_at": timestamp,
        "updated_at": timestamp,
    }

    # 4. Write agent file
    output_dir.mkdir(parents=True, exist_ok=True)
    card_path = output_dir / f"{agent_id}.json"
    card_path.write_text(
        json.dumps(agent_card, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Successfully registered agent '{product}' as '{alias}' -> {card_path}")

    # 5. Build consolidated list for private registry
    try:
        registered_list = []
        for file in output_dir.iterdir():
            if file.is_file() and file.suffix == ".json" and file.name != "registered_agents.json":
                try:
                    registered_list.append(json.loads(file.read_text(encoding="utf-8")))
                except Exception:
                    pass
        
        payload = {
            "generated_at": utc_now(),
            "count": len(registered_list),
            "agents": registered_list
        }
        
        registry_dir = output_dir.parent / "registry"
        registry_dir.mkdir(parents=True, exist_ok=True)
        registry_path = registry_dir / "registered_agents.json"
        registry_path.write_text(
            json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8"
        )
    except Exception as e:
        print(f"Warning: Could not write registered agents list to private registry: {e}")
