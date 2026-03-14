---
name: cc-ref-settings
description: |
  Claude Code settings.json reference — configuration scopes, managed settings,
  environment variables, env block, merge behavior, sandbox configuration,
  MCP settings, plugin settings, permission settings structure, permission
  modes, permission rule syntax, tool patterns.
  Background knowledge only — provides authoritative Claude Code documentation
  for settings. NOT a user-invoked command.
user-invocable: false
---

# Claude Code Reference: Settings & Permissions

## Quick Reference

### Configuration Scopes (Highest to Lowest Priority)

| Scope | Location | Shared? |
|-------|----------|---------|
| Managed | Server-managed, plist/registry, or `managed-settings.json` | Yes (IT-deployed) |
| CLI | Command-line flags (`--model`, `--allowedTools`) | No (session only) |
| Local | `.claude/settings.local.json` | No (gitignored) |
| Project | `.claude/settings.json` | Yes (committed) |
| User | `~/.claude/settings.json` | No |

### Merge Rules

- **Scalars**: higher-priority scope wins
- **Arrays**: concatenated and deduplicated across scopes (permissions.allow, permissions.deny, sandbox paths, etc.)
- **Deny at any level**: cannot be overridden — if denied anywhere, no other level can allow it
- **Hooks**: snapshot at startup; mid-session changes require `/hooks` review

### Permission Modes

| Mode | Behavior |
|------|----------|
| `default` | Prompts on first use of each tool |
| `acceptEdits` | Auto-accepts file edit permissions |
| `plan` | Read-only — no modifications or commands |
| `dontAsk` | Auto-denies unless pre-approved via allow rules |
| `bypassPermissions` | Skips all checks (dangerous — containers only) |

### Permission Rule Syntax

```
Tool                    → all uses of that tool
Tool(specifier)         → specific uses
Tool(*)                 → same as bare Tool name
```

Evaluation order: **deny → ask → allow** (first match wins).

| Tool | Pattern Examples |
|------|-----------------|
| Bash | `Bash(npm run *)`, `Bash(git diff *)` — `*` is wildcard |
| Read/Edit | Gitignore patterns: `//abs`, `~/home`, `/project-rel`, `./cwd-rel` |
| WebFetch | `WebFetch(domain:example.com)` |
| MCP | `mcp__server__tool` |
| Agent | `Agent(Explore)`, `Agent(my-agent)` |

**Critical**: `/Users/alice/file` is relative to project root — use `//Users/alice/file` for absolute paths.

### Sandbox Path Prefixes

| Prefix | Meaning | Example |
|--------|---------|---------|
| `//` | Absolute from filesystem root | `//tmp/build` → `/tmp/build` |
| `~/` | Relative to home directory | `~/.kube` |
| `/` | Relative to settings file's directory | `/build` |
| `./` | Relative path | `./output` |

### Key Settings Categories

| Category | Notable Keys |
|----------|-------------|
| General | `model`, `availableModels`, `outputStyle`, `language`, `autoUpdatesChannel` |
| Attribution | `attribution.commit`, `attribution.pr` (replaces deprecated `includeCoAuthoredBy`) |
| UI | `statusLine`, `showTurnDuration`, `spinnerVerbs`, `prefersReducedMotion` |
| Thinking | `alwaysThinkingEnabled`, `fastModePerSessionOptIn` |
| Permissions | `permissions.allow[]`, `.deny[]`, `.ask[]`, `.defaultMode`, `.additionalDirectories[]` |
| Sandbox | `sandbox.enabled`, `.autoAllowBashIfSandboxed`, `.excludedCommands[]`, `.filesystem.*`, `.network.*` |
| Hooks | `hooks{}`, `disableAllHooks`, `allowManagedHooksOnly`, `allowedHttpHookUrls[]` |
| MCP | `enableAllProjectMcpServers`, `enabledMcpjsonServers[]`, `allowedMcpServers[]` |
| Plugins | `enabledPlugins{}`, `extraKnownMarketplaces{}` |
| Auth | `forceLoginMethod`, `awsAuthRefresh`, `awsCredentialExport` |

### Key Environment Variables

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | API key |
| `ANTHROPIC_MODEL` | Override model |
| `MAX_THINKING_TOKENS` | Thinking budget (0 to disable) |
| `BASH_DEFAULT_TIMEOUT_MS` | Bash timeout |
| `MCP_TIMEOUT` / `MCP_TOOL_TIMEOUT` | MCP timeouts |
| `MAX_MCP_OUTPUT_TOKENS` | Max MCP response (default: 25000) |
| `DISABLE_TELEMETRY` | Opt out of telemetry |
| `DISABLE_AUTOUPDATER` | Disable auto-updates |

## Authoritative Sources

When you need complete documentation for settings, read these files:

- `/Users/cpconnor/Desktop/Claude Code Research/fetched_docs/settings.md` — Complete settings documentation (59KB): all configuration keys, scope behavior, managed settings, enterprise lockdown
- `/Users/cpconnor/Desktop/Claude Code Research/processed/Session_8_Schemas.md` — Pre-extracted settings tables (64KB): complete annotated JSON, all environment variables, permission rule syntax with examples, sandbox configuration, tool permission summary
- `/Users/cpconnor/projects/claude-code/examples/settings/` — Example settings files (strict, lax, bash-sandbox configurations)

Read the actual files. Do not rely on training knowledge for settings keys, accepted values, scope behavior, merge rules, or permission syntax. The files above contain the current, verified Anthropic documentation.
