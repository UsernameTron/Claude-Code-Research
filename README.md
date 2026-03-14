# Claude Code Factory

A Claude Code plugin that generates correctly-structured extensions from natural language. Describe what you want — skills, hooks, plugins, subagents, MCP configs, settings, CI/CD pipelines, or output styles — and get working configurations on the first try.

The factory uses a three-layer architecture: an invisible router detects your intent, an orchestrator resolves all technical decisions, and specialist generators produce the output. You never choose which tool to use — just describe what you need.

## Installation

### As a plugin (recommended)

```bash
# Test locally
claude --plugin-dir /path/to/claude-code-factory

# Or install from the plugin manager
/plugin install claude-code-factory
```

### Manual installation

Copy individual components to your Claude Code directories:

```bash
# Copy all skills
cp -r skills/* ~/.claude/skills/

# Copy all agents
cp -r agents/* ~/.claude/agents/
```

## Components

### Routing Layer (Layer 0)

| Skill | Description |
|-------|-------------|
| **extension-guide** | Invisible router — detects intent and delegates to the correct handler. Never exposes routing internals. |

### Orchestrator Layer (Layer 1)

| Skill | Description |
|-------|-------------|
| **extension-concierge** | Analyzes requests, auto-resolves technical decisions, routes to generators (simple) or chains subagents (complex). |
| **cc-factory** | Direct-access generator with full detection/resolution/output logic. Also called by the concierge. |

### Generator Skills (Layer 2)

| Skill | Description |
|-------|-------------|
| **skill-factory** | Generates SKILL.md files with correct frontmatter, invocation control, and tool restrictions |
| **hook-factory** | Generates hook JSON configs for all hook events and 4 handler types |
| **plugin-packager** | Packages components into distributable plugins with manifest and directory structure |
| **mcp-configurator** | Generates MCP server configurations — CLI commands, .mcp.json, scope selection |
| **settings-architect** | Generates settings.json with permissions, sandbox, model restrictions, env vars |
| **cicd-generator** | Generates GitHub Actions and GitLab CI/CD pipelines for Claude Code |
| **output-style-creator** | Creates output style files with frontmatter and system prompt content |

### Validator Skills

| Skill | Description |
|-------|-------------|
| **extension-auditor** | Scans skills and agents for structural issues, frontmatter errors, and anti-patterns |
| **upgrade-scanner** | Cross-references existing configs against latest documentation for deprecations |

### Reference Skills

Background knowledge loaded automatically by generators and the concierge. Not user-invoked.

| Skill | Coverage |
|-------|----------|
| **cc-ref-hooks** | Hook events, matchers, handler types, input/output schemas |
| **cc-ref-settings** | Configuration keys, scopes, merge behavior, env vars |
| **cc-ref-skills** | SKILL.md structure, frontmatter fields, best practices |
| **cc-ref-permissions** | Permission rule syntax, tool patterns, modes |
| **cc-ref-plugins** | Plugin manifest schema, directory structure, namespacing |
| **cc-ref-subagents** | Agent frontmatter, built-in agents, tool control, teams |
| **cc-ref-multi-agent** | Multi-agent orchestration patterns, token economics, and the three-part gate |

### Specialist Subagents

| Agent | Model | Purpose |
|-------|-------|---------|
| **hook-engineer** | Sonnet | Designs complex multi-event hook systems (coordinated PreToolUse + PostToolUse + Stop) |
| **plugin-builder** | Sonnet | Creates complete plugins with multiple component types |
| **extension-validator** | Haiku | Read-only validation of extensions against documentation schemas |

## Quick Start

```
# Just describe what you need — routing is automatic:

> I need a hook that blocks writes to .env files
> Create a skill that formats SQL queries
> Configure permissions to block curl piped to bash
> Set up GitHub Actions to review PRs with Claude
> Connect to my PostgreSQL database via MCP
> Check my skills for structural issues
> Package my skills and hooks into a plugin
> What's new in Claude Code that I should upgrade to?
> My hook isn't working — help me diagnose it
```

## Architecture

```
Layer 0: Extension Guide (invisible router)
         Detects intent → routes silently. User never sees routing.
              |
              ├──→ extension-concierge (CREATE, PACKAGE)
              ├──→ extension-auditor   (AUDIT, DIAGNOSE)
              └──→ upgrade-scanner     (UPGRADE)
              |
Layer 1: Extension Concierge (orchestrator)
         Resolves decisions → dispatches to correct generator or subagent.
              |
              ├──→ Simple path (80%): direct to generator skill
              └──→ Complex path (20%): chain subagents
              |
Layer 2: Generator Skills + Specialist Subagents
         Produce the actual files, configs, and manifests.
         Reference skills (cc-ref-*) provide schema accuracy.
```

## Project Structure

```
claude-code-factory/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── skills/                      # 19 skills (auto-discovered)
│   ├── extension-guide/         # Layer 0: invisible router
│   ├── extension-concierge/     # Layer 1: orchestrator
│   ├── cc-factory/              # Direct-access generator
│   ├── skill-factory/           # Generators (7)
│   ├── hook-factory/
│   ├── plugin-packager/
│   ├── mcp-configurator/
│   ├── settings-architect/
│   ├── cicd-generator/
│   ├── output-style-creator/
│   ├── extension-auditor/       # Validators (2)
│   ├── upgrade-scanner/
│   ├── cc-ref-multi-agent/      # Reference skills (7)
│   ├── cc-ref-hooks/
│   ├── cc-ref-settings/
│   ├── cc-ref-skills/
│   ├── cc-ref-permissions/
│   ├── cc-ref-plugins/
│   └── cc-ref-subagents/
├── agents/                      # 3 specialist subagents
│   ├── hook-engineer.md
│   ├── plugin-builder.md
│   └── extension-validator.md
└── README.md
```

## License

MIT
