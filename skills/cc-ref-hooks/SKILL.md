---
name: cc-ref-hooks
description: |
  Claude Code hooks reference — lifecycle events, PreToolUse, PostToolUse,
  SessionStart, Stop, SubagentStop, matcher patterns, hookSpecificOutput,
  handler types (command, http, prompt, agent), exit code semantics, hook
  configuration structure, blocking behavior, input/output schemas.
  Background knowledge only — provides authoritative Claude Code documentation
  for hooks. NOT a user-invoked command.
user-invocable: false
---

# Claude Code Reference: Hooks

## Quick Reference

### Hook Configuration Structure

```jsonc
{
  "hooks": {
    "<EventName>": [
      {
        "matcher": "<regex>",       // Filter when hook fires (field varies by event)
        "hooks": [
          {
            "type": "command",      // "command" | "http" | "prompt" | "agent"
            "command": "...",       // Handler-specific config
            "timeout": 60,         // Seconds (optional)
            "statusMessage": "...",// Custom spinner text (optional)
            "async": false,        // Background execution (command only)
            "once": false          // Run once per session (skills only)
          }
        ]
      }
    ]
  }
}
```

### All Hook Events

| Event | Fires When | Matcher Field | Can Block? | Handler Types |
|-------|-----------|---------------|------------|---------------|
| SessionStart | Session begins/resumes | `source` | No | command |
| InstructionsLoaded | CLAUDE.md/rules loaded | (none) | No | command |
| UserPromptSubmit | User submits prompt | (none) | Yes | command, http, prompt, agent |
| PreToolUse | Before tool execution | `tool_name` | Yes | command, http, prompt, agent |
| PermissionRequest | Permission dialog shown | `tool_name` | Yes | command, http, prompt, agent |
| PostToolUse | After tool succeeds | `tool_name` | No* | command, http, prompt, agent |
| PostToolUseFailure | After tool fails | `tool_name` | No | command, http, prompt, agent |
| Stop | Main agent finishes | (none) | Yes | command, http, prompt, agent |
| SubagentStart | Subagent spawned | `agent_type` | No | command |
| SubagentStop | Subagent finishes | `agent_type` | Yes | command, http, prompt, agent |
| TeammateIdle | Teammate going idle | (none) | Yes | command |
| TaskCompleted | Task marked complete | (none) | Yes | command |
| ConfigChange | Config file changes | `source` | Yes** | command |
| WorktreeCreate | Worktree created | (none) | Yes | command |
| WorktreeRemove | Worktree removed | (none) | No | command |
| Notification | Notification sent | `notification_type` | No | command |
| PreCompact | Before compaction | `trigger` | No | command |
| SessionEnd | Session terminates | `reason` | No | command |

*PostToolUse: `decision: "block"` feeds reason to Claude but tool already ran.
**ConfigChange: `policy_settings` changes cannot be blocked.

### Exit Code Semantics

| Exit Code | Meaning | JSON Parsed? |
|-----------|---------|--------------|
| 0 | Success — action proceeds | Yes (stdout) |
| 2 | Blocking error — action blocked (if event supports it) | No (stderr → Claude) |
| Other | Non-blocking error — continues | No (stderr in verbose only) |

### Handler Types

| Feature | command | http | prompt | agent |
|---------|---------|------|--------|-------|
| Mechanism | Shell command | HTTP POST | Single-turn LLM | Multi-turn subagent |
| Default timeout | 600s | 600s | 30s | 60s |
| Async support | Yes | No | No | No |
| Tool access | Full system | External | None | Read, Grep, Glob, Bash |
| Model field | N/A | N/A | Yes (default: haiku) | Yes (default: haiku) |
| Prompt/agent blocking | `"ok": false` | — | `"ok": false` | `"ok": false` |

### PreToolUse Decision Control

Uses `hookSpecificOutput` (NOT top-level `decision`):
- `permissionDecision`: `"allow"` | `"deny"` | `"ask"`
- `permissionDecisionReason`: shown to user (allow/ask) or Claude (deny)
- `updatedInput`: modify tool input before execution
- `additionalContext`: inject context before tool runs

### Common Input Fields (All Events)

| Field | Type | Description |
|-------|------|-------------|
| `session_id` | string | Current session ID |
| `transcript_path` | string | Path to conversation JSONL |
| `cwd` | string | Current working directory |
| `permission_mode` | string | Current mode |
| `hook_event_name` | string | Event that fired |

## Authoritative Sources

When you need complete documentation for hooks, read these files:

- `/Users/cpconnor/Desktop/Claude Code Research/fetched_docs/hooks.md` — Complete hook documentation (83KB): all events, input/output schemas, handler types, configuration examples
- `/Users/cpconnor/Desktop/Claude Code Research/fetched_docs/hooks-guide.md` — Practical hook guide (31KB): tutorials, common patterns, getting started
- `/Users/cpconnor/Desktop/Claude Code Research/processed/Session_8_Schemas.md` — Pre-extracted hook event tables (64KB): cross-validated schemas, handler comparison, exit code behavior summary, tool input schemas per event
- `/Users/cpconnor/projects/claude-code/plugins/plugin-dev/skills/hook-development/SKILL.md` — Plugin hook development patterns, advanced prompt-based hooks API, migration guides
- `/Users/cpconnor/projects/claude-code/examples/hooks/` — Example hook configurations

Read the actual files. Do not rely on training knowledge for event names, matcher fields, hookSpecificOutput structure, handler type capabilities, or exit code semantics. The files above contain the current, verified Anthropic documentation.
