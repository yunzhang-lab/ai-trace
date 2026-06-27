from __future__ import annotations

import argparse

from commands.scan_agents import build_parser as build_scan_parser
from commands.scan_agents import run_scan
from commands.register_agent import build_parser as build_register_parser
from commands.register_agent import run_register
from commands.serve_dashboard import build_parser as build_serve_parser
from commands.serve_dashboard import run_serve


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Unified CLI entrypoint for ai-trace-open."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Scan command
    scan_parser = subparsers.add_parser(
        "scan",
        help="Scan local AI agent roots and generate agent_candidates.json.",
    )
    scan_args = build_scan_parser()
    for action in scan_args._actions:
        if action.dest == "help":
            continue
        scan_parser._add_action(action)

    # Register command
    register_parser = subparsers.add_parser(
        "register",
        help="Register scanned candidate agent into ~/.ai-trace/data/agents/.",
    )
    register_args = build_register_parser()
    for action in register_args._actions:
        if action.dest == "help":
            continue
        register_parser._add_action(action)

    # Serve command
    serve_parser = subparsers.add_parser(
        "serve",
        help="Serve dashboard static files and local registry API endpoints.",
    )
    serve_args = build_serve_parser()
    for action in serve_args._actions:
        if action.dest == "help":
            continue
        serve_parser._add_action(action)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "scan":
        run_scan(args)
        return
    elif args.command == "register":
        run_register(args)
        return
    elif args.command == "serve":
        run_serve(args)
        return

    parser.error(f"Unsupported command: {args.command}")


if __name__ == "__main__":
    main()
