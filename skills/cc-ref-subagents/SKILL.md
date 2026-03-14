---
name: cc-ref-subagents
description: |
  Claude Code subagents reference — agent frontmatter fields, built-in agents
  (Explore, Plan, general-purpose), custom agent creation, tools/disallowedTools,
  model selection, permissionMode, maxTurns, skills preloading, mcpServers
  scoping, hooks in agents, persistent memory, background/isolation modes,
  agent teams, nesting constraints.
  Background knowledge only — provides authoritative Claude Code documentation
  for subagents. NOT a user-invoked command.
user-invocable: false
---

# Claude Code Reference: Subagents

## Quick Reference

### Subagent File Format

```yaml
---
name: agent-name              # Required: lowercase + hyphens
description: When to use      # Required: triggers auto-delegation
tools: Read, Grep, Glob       # Optional: inherits all if omitted
disallowedTools: Write, Edit  # Optional: removed from inherited set
model: sonnet                 # Optional: sonnet|opus|haiku|inherit|full-ID
permissionMode: default       # Optional: default|acceptEdits|dontAsk|bypassPermissions|plan
maxTurns: 25                  # Optional: max agentic turns
skills:                       # Optional: skill content injected at startup
  - skill-name-1
  - skill-name-2
mcpServers:                   # Optional: MCP servers scoped to this agent
  - server-name               # String = reuse parent's connection
  - custom-server:             # Object = inline definition
      type: stdio
      command: npx
      args: ["-y", "@some/server"]
hooks:                        # Optional: lifecycle hooks scoped to agent
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./validate.sh"
memory: user                  # Optional: user|project|local
background: false             # Optional: run as background task
isolation: worktree            # Optional: run in isolated git worktree
---

System prompt goes here. This is what the subagent receives as its instructions.
```

### All Frontmatter Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | Yes | string | Lowercase letters and hyphens |
| `description` | Yes | string | When Claude should delegate to this agent |
| `tools` | No | string (CSV) | Allowlist of tools. Inherits all if omitted |
| `disallowedTools` | No | string (CSV) | Tools to remove from inherited/specified set |
| `model` | No | string | `sonnet`, `opus`, `haiku`, full model ID, or `inherit` (default) |
| `permissionMode` | No | string | Permission mode override |
| `maxTurns` | No | number | Max agentic turns before stopping |
| `skills` | No | list | Skills injected into context at startup |
| `mcpServers` | No | list | MCP servers (string refs or inline defs) |
| `hooks` | No | object | Lifecycle hooks scoped to this agent |
| `memory` | No | string | Persistent memory: `user`, `project`, or `local` |
| `background` | No | boolean | Always run as background task |
| `isolation` | No | string | `worktree` for isolated git worktree |

### Built-in Subagents

| Agent | Model | Tools | Purpose |
|-------|-------|-------|---------|
| Explore | Haiku | Read-only (no Write/Edit) | Fast codebase search and analysis |
| Plan | Inherit | Read-only (no Write/Edit) | Research for plan mode |
| General-purpose | Inherit | All | Complex multi-step tasks |
| Bash | Inherit | Bash | Terminal commands in separate context |
| Claude Code Guide | Haiku | Read-only | Questions about Claude Code features |

### Subagent Scope & Priority

| Location | Scope | Priority |
|----------|-------|----------|
| `--agents` CLI flag (JSON) | Current session | 1 (highest) |
| `.claude/agents/` | Current project | 2 |
| `~/.claude/agents/` | All user projects | 3 |
| Plugin `agents/` directory | Where plugin is enabled | 4 (lowest) |

Same name → higher priority wins.

### Key Constraints

- **No nesting**: Subagents cannot spawn other subagents
- **No inherited skills**: Subagents don't inherit skills from parent — must list explicitly
- **System prompt only**: Subagents receive their markdown body + environment details, not the full Claude Code system prompt
- **Agent(type) in tools**: Use `Agent(worker, researcher)` in `tools` to restrict which agents a main-thread agent can spawn (only applies to `claude --agent`, not subagents)
- **Immediate availability**: New agents are available immediately (no restart needed via `/agents`)

### Memory Scopes

| Scope | Location | Use When |
|-------|----------|----------|
| `user` | `~/.claude/agent-memory/<name>/` | Learnings across all projects |
| `project` | `.claude/agent-memory/<name>/` | Project-specific, shareable via git |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, not in git |

When memory is enabled: Read/Write/Edit tools auto-added, system prompt includes memory instructions, first 200 lines of MEMORY.md injected.

### CLI-Defined Agents

```bash
claude --agents '{
  "my-agent": {
    "description": "...",
    "prompt": "...",
    "tools": ["Read", "Bash"],
    "model": "sonnet"
  }
}'
```

`prompt` field = system prompt (equivalent to markdown body in file-based agents).

## Authoritative Sources

When you need complete documentation for subagents, read these files:

- `/Users/cpconnor/Desktop/Claude Code Research/fetched_docs/sub-agents.md` — Complete subagent documentation (39KB): built-in agents, creation, all frontmatter fields, tool control, MCP scoping, hooks, memory, examples
- `/Users/cpconnor/Desktop/Claude Code Research/fetched_docs/agent-teams.md` — Agent teams documentation (24KB): multi-agent coordination, team configuration, communication patterns

Read the actual files. Do not rely on training knowledge for frontmatter fields, tool names, model options, or nesting constraints. The files above contain the current, verified Anthropic documentation.
