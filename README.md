# Claude Code Factory

A Claude Code plugin that generates correctly-structured extensions from natural language. Describe what you want — skills, hooks, plugins, subagents, MCP configs, settings, CI/CD pipelines, or output styles — and get working configurations on the first try.

The factory reads official Claude Code documentation schemas before producing output, so configurations are correct by construction rather than guessed from training knowledge.

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

### Unified Factory (Layer 1)

| Skill | Description |
|-------|-------------|
| **cc-factory** | Routes natural language requests to the correct generator. Entry point for all extension creation. |

### Generator Skills (Layer 2)

| Skill | Description |
|-------|-------------|
| **skill-factory** | Generates SKILL.md files with correct frontmatter, invocation control, and tool restrictions |
| **hook-factory** | Generates hook JSON configs for all 18 events and 4 handler types |
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

### Reference Skills (Layer 0)

Background knowledge loaded automatically by generators and agents. Not user-invoked.

| Skill | Coverage |
|-------|----------|
| **cc-ref-hooks** | Hook events, matchers, handler types, input/output schemas |
| **cc-ref-settings** | Configuration keys, scopes, merge behavior, env vars |
| **cc-ref-skills** | SKILL.md structure, frontmatter fields, best practices |
| **cc-ref-permissions** | Permission rule syntax, tool patterns, modes |
| **cc-ref-plugins** | Plugin manifest schema, directory structure, namespacing |
| **cc-ref-subagents** | Agent frontmatter, built-in agents, tool control, teams |

### Specialist Subagents

| Agent | Model | Purpose |
|-------|-------|---------|
| **hook-engineer** | Sonnet | Designs complex multi-event hook systems (coordinated PreToolUse + PostToolUse + Stop) |
| **plugin-builder** | Sonnet | Creates complete plugins with multiple component types |
| **extension-validator** | Haiku | Read-only validation of extensions against documentation schemas |

## Quick Start

```
# Generate a skill
> Create a skill that formats SQL queries before execution

# Generate hooks
> Write a hook that auto-lints TypeScript files after every Write

# Generate settings
> Configure permissions to allow git commands but block curl piped to bash

# Generate a CI/CD pipeline
> Set up GitHub Actions to review PRs with Claude Code

# Generate MCP config
> Connect to my PostgreSQL database via MCP

# Audit existing extensions
> Scan my skills for structural issues

# Package into a plugin
> Package my skills and hooks into a distributable plugin
```

## Architecture

```
Layer 0: Reference Skills (cc-ref-*)
         Embed critical schemas from official Claude Code docs.
         Auto-loaded by generators — never invoked directly.
              |
Layer 1: Unified Factory (cc-factory)
         Routes requests → detects type → loads references → resolves decisions.
              |
Layer 2: Generator Skills + Specialist Subagents
         Single-file outputs (80%): generator skills handle directly.
         Multi-file outputs (20%): subagents coordinate complex builds.
```

## Project Structure

```
claude-code-factory/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/                   # 16 skills (auto-discovered)
│   ├── cc-factory/           # Unified factory router
│   ├── skill-factory/        # Generators (7)
│   ├── hook-factory/
│   ├── plugin-packager/
│   ├── mcp-configurator/
│   ├── settings-architect/
│   ├── cicd-generator/
│   ├── output-style-creator/
│   ├── extension-auditor/    # Validators (2)
│   ├── upgrade-scanner/
│   ├── cc-ref-hooks/         # Reference skills (6)
│   ├── cc-ref-settings/
│   ├── cc-ref-skills/
│   ├── cc-ref-permissions/
│   ├── cc-ref-plugins/
│   └── cc-ref-subagents/
├── agents/                   # 3 specialist subagents
│   ├── hook-engineer.md
│   ├── plugin-builder.md
│   └── extension-validator.md
└── README.md
```

## License

MIT
