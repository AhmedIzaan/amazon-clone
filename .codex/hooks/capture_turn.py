#!/usr/bin/env python3
"""Append Codex prompts and final responses to a submission-safe session log."""

from __future__ import annotations

import datetime as dt
import json
import os
from pathlib import Path
import re
import sys


AUTHOR = "AhmedIzaan"
TOOL = "codex-cli"


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="milliseconds").replace(
        "+00:00", "Z"
    )


def safe_component(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]", "-", value)


def find_log(log_dir: Path, session_id: str) -> Path | None:
    matches = sorted(log_dir.glob(f"*_{safe_component(session_id)}.md"))
    return matches[-1] if matches else None


def create_log(
    log_dir: Path,
    session_id: str,
    timestamp: str,
    model: str,
    project: str,
) -> Path:
    date = timestamp[:10]
    clock = timestamp[11:19].replace(":", "-")
    path = log_dir / f"{date}_{clock}_{safe_component(session_id)}.md"
    path.write_text(
        "\n".join(
            [
                "---",
                f"session_id: {session_id}",
                f"date: {date}",
                f"author: {AUTHOR}",
                f"model: {model}",
                f"tool: {TOOL}",
                f"project: {project}",
                "total_exchanges: 0",
                f"first_prompt_time: {timestamp}",
                f"last_prompt_time: {timestamp}",
                "---",
                "",
                f"# Session Log - {date}",
                "",
                f"Session: `{session_id[:8]}` | Project: `{project}` | Author: `{AUTHOR}`",
                "",
                "---",
                "",
            ]
        ),
        encoding="utf-8",
    )
    return path


def update_prompt_metadata(text: str, exchange: int, timestamp: str) -> str:
    text = re.sub(
        r"(?m)^total_exchanges: \d+$",
        f"total_exchanges: {exchange}",
        text,
        count=1,
    )
    return re.sub(
        r"(?m)^last_prompt_time: .+$",
        f"last_prompt_time: {timestamp}",
        text,
        count=1,
    )


def append_entry(path: Path, entry: str) -> None:
    with path.open("a", encoding="utf-8") as stream:
        stream.write(entry)


def main() -> int:
    payload = json.load(sys.stdin)
    event = payload.get("hook_event_name", "")
    session_id = str(payload.get("session_id") or "unknown-session")
    model = str(payload.get("model") or "unknown-model")
    cwd = Path(str(payload.get("cwd") or os.getcwd())).resolve()
    repo = Path(
        os.environ.get("CODEX_REPO_ROOT")
        or os.popen("git rev-parse --show-toplevel 2>/dev/null").read().strip()
        or cwd
    ).resolve()
    log_dir = repo / ".agent-logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    project = repo.name
    timestamp = utc_now()
    path = find_log(log_dir, session_id)

    if event == "UserPromptSubmit":
        prompt = payload.get("prompt")
        if not isinstance(prompt, str):
            return 0
        if path is None:
            path = create_log(log_dir, session_id, timestamp, model, project)
        text = path.read_text(encoding="utf-8")
        exchange = len(re.findall(r"(?m)^\[LOG_ENTRY type=PROMPT ", text)) + 1
        path.write_text(
            update_prompt_metadata(text, exchange, timestamp), encoding="utf-8"
        )
        append_entry(
            path,
            f"[LOG_ENTRY type=PROMPT num={exchange} session={session_id[:8]}]\n"
            f"timestamp: {timestamp}\n"
            f"model: {model}\n\n"
            f"{prompt}\n\n\n",
        )
        return 0

    if event == "Stop" and path is not None:
        response = payload.get("last_assistant_message")
        if not isinstance(response, str):
            return 0
        text = path.read_text(encoding="utf-8")
        prompt_count = len(re.findall(r"(?m)^\[LOG_ENTRY type=PROMPT ", text))
        response_count = len(re.findall(r"(?m)^\[LOG_ENTRY type=RESPONSE ", text))
        if prompt_count > response_count:
            append_entry(
                path,
                f"[LOG_ENTRY type=RESPONSE num={prompt_count} session={session_id[:8]}]\n"
                f"timestamp: {timestamp}\n"
                f"model: {model}\n\n"
                f"{response}\n\n\n",
            )
        return 0

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:  # Hooks must never block the user's Codex turn.
        print(f"capture hook warning: {error}", file=sys.stderr)
        raise SystemExit(0)
