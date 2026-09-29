# Capture Test

## Tool and model

- Tool: Codex CLI `0.155.0-alpha.16.3`
- Model: `gpt-5.6-sol` with medium reasoning
- Planning: `gpt-5.6-sol`
- Execution: `gpt-5.6-sol`

## Capture mechanism

Codex's native lifecycle hooks run the repository script
`.codex/hooks/capture_turn.py` automatically. `UserPromptSubmit` records the
verbatim prompt and `Stop` records `last_assistant_message`, the final response.
Both hook payloads supply the session ID and active model; the script adds a UTC
timestamp and maintains one Markdown log per session.

The project hook configuration is `.codex/hooks.json`. The canary commands used
`--dangerously-bypass-hook-trust` while the local definitions were being reviewed.
The definitions were then persistently approved through Codex's native hook review
screen. A second two-session test was run without that flag; both hooks fired
automatically in both sessions.

## Canary log paths

- `.agent-logs/2026-09-29_19-26-02_01a0eea1-8d7e-7301-b850-c7ee7ac8dbf0.md`
- `.agent-logs/2026-09-29_19-26-35_01a0eea2-0b92-7e80-853e-f08c1173da3a.md`

## Raw canary entries

### Session 1

```text
[LOG_ENTRY type=PROMPT num=1 session=01a0eea1]
timestamp: 2026-09-29T19:26:02.343Z
model: gpt-5.6-sol

CAPTURE TEST — 8x assignment, Ahmed Izaan


[LOG_ENTRY type=RESPONSE num=1 session=01a0eea1]
timestamp: 2026-09-29T19:26:05.072Z
model: gpt-5.6-sol

Captured: **8× assignment — Ahmed Izaan**.
```

### Session 2

```text
[LOG_ENTRY type=PROMPT num=1 session=01a0eea2]
timestamp: 2026-09-29T19:26:35.749Z
model: gpt-5.6-sol

CAPTURE TEST — 8x assignment, Ahmed Izaan


[LOG_ENTRY type=RESPONSE num=1 session=01a0eea2]
timestamp: 2026-09-29T19:26:40.230Z
model: gpt-5.6-sol

Ready for the “8x assignment,” Ahmed Izaan. Please send the task details or acceptance criteria.
```

## Trusted-hook verification rerun

These two fresh sessions were launched without `--dangerously-bypass-hook-trust`
after the project hooks had been persistently trusted.

- `.agent-logs/2026-09-29_19-35-00_01a0eea9-c117-79b0-8934-9c5fb6ae7de2.md`
- `.agent-logs/2026-09-29_19-35-46_01a0eeaa-7409-7b82-afcd-916a621bf649.md`

### Trusted session 1

```text
[LOG_ENTRY type=PROMPT num=1 session=01a0eea9]
timestamp: 2026-09-29T19:35:00.170Z
model: gpt-5.6-sol

CAPTURE TEST — 8x assignment, Ahmed Izaan


[LOG_ENTRY type=RESPONSE num=1 session=01a0eea9]
timestamp: 2026-09-29T19:35:03.795Z
model: gpt-5.6-sol

Captured: **8x assignment — Ahmed Izaan**.
```

### Trusted session 2

```text
[LOG_ENTRY type=PROMPT num=1 session=01a0eeaa]
timestamp: 2026-09-29T19:35:46.227Z
model: gpt-5.6-sol

CAPTURE TEST — 8x assignment, Ahmed Izaan


[LOG_ENTRY type=RESPONSE num=1 session=01a0eeaa]
timestamp: 2026-09-29T19:36:05.288Z
model: gpt-5.6-sol

Captured: **8x assignment — Ahmed Izaan**.
```

## Initial attempt that did not work

The first canary launch included `--ask-for-approval never`. This Codex version
accepts that option on the top-level interactive command but not after the
`codex exec` subcommand, so argument parsing stopped before a session or prompt
was created. The retry removed that unsupported flag; `codex exec` reported its
effective approval mode as `never`, and both native hooks completed.
