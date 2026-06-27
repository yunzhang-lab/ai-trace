from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from commands.register_agent import build_parser as build_register_parser
from commands.register_agent import run_register
from commands.scan_agents import build_parser as build_scan_parser
from commands.scan_agents import run_scan

VALID_INTAKE_STATUSES = {"unregistered", "skipped"}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind. Defaults to 127.0.0.1.")
    parser.add_argument("--port", type=int, default=8787, help="Port to bind. Defaults to 8787.")
    return parser


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def read_json_payload(path: Path, list_key: str) -> dict:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"generated_at": utc_now(), "count": 0, list_key: []}


def read_list_payload(path: Path) -> list:
    if path.exists():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, list):
                return data
        except Exception:
            pass
    return []


def read_intake_state(path: Path) -> dict:
    if path.exists():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return {
                    "generated_at": data.get("generated_at") or utc_now(),
                    "agents": data.get("agents") or {},
                    "spaces": data.get("spaces") or {},
                }
        except Exception:
            pass
    return {"generated_at": utc_now(), "agents": {}, "spaces": {}}


def write_intake_state(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def set_intake_status(path: Path, kind: str, item_id: str, status: str) -> dict:
    if kind not in {"agents", "spaces"}:
        raise ValueError("invalid intake kind")
    if status not in VALID_INTAKE_STATUSES:
        raise ValueError("invalid intake status")
    payload = read_intake_state(path)
    bucket = payload[kind]
    if status == "skipped":
        bucket[item_id] = {"status": "skipped", "updated_at": utc_now()}
        result = bucket[item_id]
    else:
        bucket.pop(item_id, None)
        result = {"status": "unregistered", "updated_at": utc_now()}
    payload["generated_at"] = utc_now()
    write_intake_state(path, payload)
    return result


def update_space_record(path: Path, data: dict) -> dict:
    payload = read_json_payload(path, "spaces")
    spaces = payload.get("spaces", [])
    target = None
    for item in spaces:
        if item.get("space_id") == data.get("space_id"):
            target = item
            break
    if target is None:
        raise ValueError("space_id not found")

    purpose = (data.get("purpose") or "").strip()
    target["purpose"] = purpose
    target["visibility"] = data.get("visibility") or target.get("visibility") or "all"
    if data.get("purpose_tag"):
        target["purpose_tag"] = data["purpose_tag"]
    if purpose and target.get("purpose_tag") == "未声明":
        target["purpose_tag"] = "文档"
    target["status"] = "declared" if purpose or target.get("purpose_tag") != "未声明" else "undeclared"
    target["last_scan"] = utc_now()
    payload["generated_at"] = utc_now()
    payload["count"] = len(spaces)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return target


def build_registered_indexes(registered_payload: dict) -> tuple[set[str], set[str], set[tuple[str, str]]]:
    agents = registered_payload.get("agents", []) if isinstance(registered_payload, dict) else []
    candidate_ids = {item.get("candidate_id") for item in agents if item.get("candidate_id")}
    agent_ids = {item.get("agent_id") for item in agents if item.get("agent_id")}
    workspace_pairs = {
        (item.get("product"), item.get("selected_workspace_masked"))
        for item in agents
        if item.get("product") and item.get("selected_workspace_masked")
    }
    return candidate_ids, agent_ids, workspace_pairs


def augment_candidates_payload(candidates_payload: dict, registered_payload: dict, intake_state: dict) -> dict:
    candidate_ids, agent_ids, workspace_pairs = build_registered_indexes(registered_payload)
    decisions = intake_state.get("agents", {}) if isinstance(intake_state, dict) else {}
    enriched = []
    for item in candidates_payload.get("candidates", []):
        row = dict(item)
        decision = decisions.get(row.get("candidate_id"), {})
        intake_status = decision.get("status")
        candidate_workspace_key = (row.get("product"), row.get("selected_workspace_masked"))
        if (
            candidate_workspace_key in workspace_pairs
            or row.get("candidate_id") in candidate_ids
            or row.get("agent_id") in agent_ids
        ):
            resolved = "registered"
        elif intake_status == "skipped":
            resolved = "skipped"
        else:
            resolved = "unregistered"
        row["intake_status"] = resolved
        row["decision_updated_at"] = decision.get("updated_at")
        enriched.append(row)
    payload = dict(candidates_payload)
    payload["candidates"] = enriched
    payload["count"] = len(enriched)
    return payload


def augment_spaces_payload(spaces_payload: dict, intake_state: dict) -> dict:
    decisions = intake_state.get("spaces", {}) if isinstance(intake_state, dict) else {}
    enriched = []
    for item in spaces_payload.get("spaces", []):
        row = dict(item)
        decision = decisions.get(row.get("space_id"), {})
        intake_status = decision.get("status")
        if row.get("status") == "declared":
            resolved = "registered"
        elif intake_status == "skipped":
            resolved = "skipped"
        else:
            resolved = "unregistered"
        row["intake_status"] = resolved
        row["decision_updated_at"] = decision.get("updated_at")
        enriched.append(row)
    payload = dict(spaces_payload)
    payload["spaces"] = enriched
    payload["count"] = len(enriched)
    return payload


def make_handler(skill_root: Path):
    registry_root = Path("~/.ai-trace/data/registry").expanduser()
    candidates_path = registry_root / "agent_candidates.json"
    registered_path = registry_root / "registered_agents.json"
    workspaces_path = registry_root / "workspace_candidates.json"
    spaces_path = registry_root / "spaces.json"
    intake_path = registry_root / "intake_status.json"

    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(skill_root), **kwargs)

        def do_GET(self) -> None:
            parsed = urlparse(self.path)
            if parsed.path == "/":
                self.send_response(HTTPStatus.FOUND)
                self.send_header("Location", "/ui/index.html")
                self.end_headers()
                return

            intake_state = read_intake_state(intake_path)
            if parsed.path == "/api/registry/candidates":
                payload = augment_candidates_payload(
                    read_json_payload(candidates_path, "candidates"),
                    read_json_payload(registered_path, "agents"),
                    intake_state,
                )
                self._write_json(payload)
                return

            if parsed.path == "/api/registry/registered":
                self._write_json(read_json_payload(registered_path, "agents"))
                return

            if parsed.path == "/api/registry/workspaces":
                self._write_json(read_list_payload(workspaces_path))
                return

            if parsed.path == "/api/registry/spaces":
                payload = augment_spaces_payload(read_json_payload(spaces_path, "spaces"), intake_state)
                self._write_json(payload)
                return

            super().do_GET()

        def do_POST(self) -> None:
            parsed = urlparse(self.path)
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length) if content_length else b"{}"
            try:
                data = json.loads(body or b"{}")
            except Exception:
                self._write_error(HTTPStatus.BAD_REQUEST, "Invalid JSON body")
                return

            try:
                if parsed.path == "/api/registry/register":
                    candidate_id = data.get("candidate_id")
                    if not candidate_id:
                        self._write_error(HTTPStatus.BAD_REQUEST, "Missing candidate_id")
                        return

                    alias = data.get("alias")
                    workspace = data.get("workspace")
                    notes = data.get("notes")

                    parser = build_register_parser()
                    cli_args = ["--candidate-id", candidate_id]
                    if alias:
                        cli_args.extend(["--alias", alias])
                    if workspace:
                        cli_args.extend(["--workspace", workspace])
                    if notes is not None:
                        cli_args.extend(["--notes", notes])

                    args = parser.parse_args(cli_args)
                    run_register(args)
                    set_intake_status(intake_path, "agents", candidate_id, "unregistered")
                    self._write_json({"status": "ok", "candidate_id": candidate_id})
                    return

                if parsed.path == "/api/registry/agents/intake":
                    candidate_id = data.get("candidate_id")
                    status = data.get("status")
                    if not candidate_id:
                        self._write_error(HTTPStatus.BAD_REQUEST, "Missing candidate_id")
                        return
                    result = set_intake_status(intake_path, "agents", candidate_id, status)
                    self._write_json({"status": "ok", "candidate_id": candidate_id, "intake": result})
                    return

                if parsed.path == "/api/registry/spaces":
                    updated = update_space_record(spaces_path, data)
                    set_intake_status(intake_path, "spaces", updated["space_id"], "unregistered")
                    self._write_json({"status": "ok", "space": updated})
                    return

                if parsed.path == "/api/registry/spaces/intake":
                    space_id = data.get("space_id")
                    status = data.get("status")
                    if not space_id:
                        self._write_error(HTTPStatus.BAD_REQUEST, "Missing space_id")
                        return
                    result = set_intake_status(intake_path, "spaces", space_id, status)
                    self._write_json({"status": "ok", "space_id": space_id, "intake": result})
                    return

                if parsed.path == "/api/scan":
                    parser = build_scan_parser()
                    scan_args = parser.parse_args([])
                    run_scan(scan_args)
                    self._write_json({"status": "ok"})
                    return
            except FileNotFoundError as exc:
                self._write_error(HTTPStatus.NOT_FOUND, str(exc))
                return
            except ValueError as exc:
                self._write_error(HTTPStatus.BAD_REQUEST, str(exc))
                return
            except Exception as exc:
                self._write_error(HTTPStatus.INTERNAL_SERVER_ERROR, str(exc))
                return

            self._write_error(HTTPStatus.NOT_FOUND, "Endpoint not found")

        def _write_json(self, payload: dict | list) -> None:
            content = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)

        def _write_error(self, status: HTTPStatus, message: str) -> None:
            payload = json.dumps({"error": message}, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

        def log_message(self, format: str, *args) -> None:
            print(f"[serve] {self.address_string()} - {format % args}")

    return Handler


def run_serve(args: argparse.Namespace) -> None:
    skill_root = Path(__file__).resolve().parents[2]
    handler = make_handler(skill_root)
    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Serving ai-trace skill at http://{args.host}:{args.port}")
    print("Dashboard: /ui/index.html")
    print("API: /api/registry/candidates, /api/registry/registered, /api/registry/workspaces, /api/registry/spaces")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
    finally:
        server.server_close()
