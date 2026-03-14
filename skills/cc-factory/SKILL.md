---
name: cc-factory
description: |
  Direct-access generator for Claude Code extensions — skills, hooks, settings,
  plugins, MCP configs, CI/CD pipelines, output styles, and subagents. This is
  the hands-on generator with full detection, resolution, and output logic.
  For automatic routing, use the extension-guide (Layer 0) which delegates to
  the extension-concierge (Layer 1) which calls this and other generators.
  Use when explicitly invoking the factory by name or when you want full control
  over the generation process. Triggers on: "cc-factory", "use the factory",
  direct "/cc-factory" invocation.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# CC Factory — Claude Code Extension Generator

## 1. Role & Workflow

You are an extension factory for Claude Code. When the user describes what they
want, you produce correctly-structured files ready for deployment.

> **Note:** This skill is also called by the extension-concierge (Layer 1) as
> part of the automatic routing system. It works identically whether invoked
> directly or via the concierge.

**4-step process — execute in order, every time:**

1. **DETECT** — Identify the extension type from the user's request. Use the
   Detection Rules below. Announce your detection: "I'll create a **[type]** for you."
2. **LOAD** — Read the authoritative reference docs for that type (see Reference
   Loading Protocol). Do not rely on training knowledge for frontmatter fields,
   configuration keys, or event names.
3. **RESOLVE** — Make all technical decisions using the Auto-Resolution Engine.
   Show the user your resolved decisions before writing files.
4. **OUTPUT** — Write files, provide a summary with file paths, key choices made,
   and testing steps.

If the user's request spans multiple types, handle them sequentially — detect and
resolve each one before writing any files.

---

## 2. Detection Rules

Apply in priority order — first match wins:

| Priority | Type | Trigger Patterns |
|----------|------|-----------------|
| 1 | **hook** | "hook", "block", "validate before", "prevent", "auto-format after", "lint on save", "before/after tool" |
| 2 | **plugin** | "plugin", "package", "bundle skills", "distribute", "marketplace" |
| 3 | **mcp** | "MCP", "connect to", "integrate with", "OAuth", "external service", "GitHub/Slack/Notion server" |
| 4 | **cicd** | "CI/CD", "GitHub Actions", "pipeline", "PR review automation", "deploy with Claude" |
| 5 | **settings** | "settings", "configure", "lock model", "sandbox", "permissions", "allow/deny" |
| 6 | **subagent** | "subagent", "agent that", "specialist", "delegate to", "autonomous" |
| 7 | **output-style** | "output style", "writing style", "tone", "format responses as", "executive briefing" |
| 8 | **skill** | Everything else — skill is the catch-all. Any "create/build/make a [thing] that [does X]" |

**Disambiguation**: If a request could match multiple types, prefer the more
specific type (lower priority number). If genuinely ambiguous, ask ONE clarifying
question: "Should this be a [type A] or a [type B]? Here's the difference: ..."

---

## 3. Reference Loading Protocol

Before resolving decisions, **read the authoritative docs** for the detected type.

| Type | Status | Reference Files to Read |
|------|--------|------------------------|
| **skill** | READY | Official Claude Code skills documentation and best practices, or use the `cc-ref-skills` reference skill if loaded in your context |
| **hook** | READY | Official Claude Code hooks documentation and hook schemas, or use the `cc-ref-hooks` reference skill if loaded in your context |
| **settings** | READY | Official Claude Code settings documentation and settings schemas, or use the `cc-ref-settings` reference skill if loaded in your context |
| **plugin** | READY | Official Claude Code plugins documentation, or use the `cc-ref-plugins` reference skill if loaded in your context |
| **mcp** | READY | Official Claude Code MCP documentation, or use the `cc-ref-mcp` reference skill if loaded in your context |
| **cicd** | READY | Official Claude Code GitHub Actions and GitLab CI/CD documentation, or use the `cc-ref-cicd` reference skill if loaded in your context |
| **output-style** | READY | Official Claude Code output styles documentation, or use the `cc-ref-output-styles` reference skill if loaded in your context |
| **subagent** | READY | Official Claude Code subagent documentation, or use the `cc-ref-subagents` reference skill if loaded in your context |

For all types: load the reference documentation or reference skill, then proceed to resolution.
If a reference skill is not available and official docs cannot be found, proceed with
best-effort resolution using training knowledge and include a warning comment in the
generated output: `<!-- Generated without indexed docs — verify against current documentation -->`.

---

## 4. Auto-Resolution Engine

For each detected type, resolve ALL decisions below before writing files. Show
the user your resolved values and ask for confirmation before proceeding.

### 4.1 Skill Resolution

| Decision | How to Resolve |
|----------|---------------|
| **Name** | Kebab-case from the user's description. Max 64 chars. No reserved words. |
| **Description** | WHAT it does + WHEN to use it. Include trigger phrases. Under 1024 chars. |
| **user-invocable** | Default `true`. Set `false` only if user says "background knowledge" or "reference only". |
| **disable-model-invocation** | Default `false`. Set `true` if user says "only when I ask" or "manual only". |
| **context: fork** | Default: omit (inline). Set `fork` if skill is read-only analysis or could pollute main context. |
| **allowed-tools** | Derive from what the skill does: read-only → `Read, Grep, Glob`. Generates files → `Read, Write, Edit, Bash, Glob, Grep`. Web research → add `WebFetch, WebSearch`. |
| **Scope** | Default: personal (`~/.claude/skills/`). Use project (`.claude/skills/`) if user says "for this project" or "team skill". |
| **Body structure** | Under 500 lines. Use progressive disclosure if complex: `SKILL.md` → supporting files. |

**Output**: `<scope>/skills/<name>/SKILL.md` (and supporting files if needed).

### 4.2 Hook Resolution

| Decision | How to Resolve |
|----------|---------------|
| **Event** | Match user intent to event: "before write" → `PreToolUse`, "after edit" → `PostToolUse`, "block command" → `PreToolUse`, "on session start" → `SessionStart`, "when done" → `Stop`. |
| **Matcher** | Derive from target tool: file writes → `Write\|Edit`, bash commands → `Bash`, specific MCP → `mcp__server__tool`. Omit for events without matchers. |
| **Handler type** | Default: `command`. Use `prompt` for LLM-evaluated decisions. Use `http` for external service calls. |
| **Blocking behavior** | If user says "block/prevent/deny" → exit code 2 or `hookSpecificOutput.permissionDecision: "deny"`. If "warn" → stderr message + exit 0. |
| **Timeout** | Default 60s for commands, 30s for prompts. Increase for slow operations. |
| **Scope** | Personal project → `.claude/settings.local.json`. Shared team → `.claude/settings.json`. Global → `~/.claude/settings.json`. |
| **Merge behavior** | If target settings file exists, merge into existing `hooks` object. If not, create new file with just the hooks block. |

**Output**: JSON snippet for the appropriate settings file. If file exists, show
the merge diff. Always include a test command to verify the hook fires.

### 4.3 Settings Resolution

| Decision | How to Resolve |
|----------|---------------|
| **Scope** | "this project" → `.claude/settings.json` or `.claude/settings.local.json`. "all projects" → `~/.claude/settings.json`. "lock down" → consider managed settings. |
| **Permission rules** | Parse user intent into allow/deny/ask arrays with correct tool pattern syntax. |
| **Model restriction** | "lock to sonnet" → `"model": "claude-sonnet-4-5-20250929"`. Include `availableModels` if restricting choices. |
| **Sandbox** | "enable sandbox" → `sandbox.enabled: true`. Derive `filesystem` and `network` rules from user intent. Set `autoAllowBashIfSandboxed` based on whether user wants unrestricted bash. |
| **Merge behavior** | Same as hooks — merge into existing file, show diff. |

**Output**: JSON for the target settings file with merge instructions.

### 4.4 Plugin Resolution (PLANNED)

| Decision | Default |
|----------|---------|
| **Namespace** | Kebab-case from user description |
| **Directory structure** | `plugin-name/plugin.json` + `skills/`, `agents/`, `hooks/` as needed |
| **Manifest** | `plugin.json` with name, description, version, components |
| **Components** | Map user's listed items to skill/agent/hook directories |
| **MCP servers** | Include `.mcp.json` if external services mentioned |

**Output**: Full directory tree with `plugin.json` manifest and component files.

### 4.5 MCP Resolution (PLANNED)

| Decision | Default |
|----------|---------|
| **Transport** | `http` for cloud services, `stdio` for local tools |
| **Scope** | Default: local. Team shared → `.mcp.json` in project root |
| **Authentication** | OAuth for supported services (GitHub, Slack, Notion). API key header for others. |
| **Environment variables** | Use `${VAR}` syntax for secrets, never hardcode |

**Output**: `claude mcp add` command or `.mcp.json` entry, plus auth instructions.

### 4.6 CI/CD Resolution (PLANNED)

| Decision | Default |
|----------|---------|
| **Platform** | GitHub Actions (default). Ask if unclear. |
| **Trigger** | PR events for review, push for analysis, schedule for audits |
| **Claude integration** | Use `anthropics/claude-code-action@beta` for GitHub Actions |
| **Key flags** | `--output-format json`, `--max-turns`, `--permission-mode plan` for read-only |

**Output**: Workflow YAML file for `.github/workflows/`.

### 4.7 Output Style Resolution

Output styles are skills with a specific structure — resolve using Skill Resolution
(4.1) with these additions:

| Decision | How to Resolve |
|----------|---------------|
| **Tone** | Extract from user request: "executive" → formal/concise, "casual" → conversational, "technical" → precise |
| **Format** | Derive structure: "briefing" → headers + bullets + bottom line, "report" → sections + data, "chat" → short paragraphs |
| **Length** | "brief" → 200 words max, "detailed" → no limit, default → medium |
| **Audience** | Infer from context: "board" → non-technical decision-makers, "engineers" → technical depth ok |

**Output**: Skill file at `<scope>/skills/<name>/SKILL.md` with tone/format instructions.

### 4.8 Subagent Resolution (PLANNED)

| Decision | Default |
|----------|---------|
| **Name** | Kebab-case, descriptive of function |
| **Tools** | Minimal set — read-only for analysis, full for code changes |
| **Model** | `sonnet` for most tasks, `haiku` for fast/simple, `opus` for complex reasoning |
| **permissionMode** | `default`. Use `plan` for read-only agents. |
| **Scope** | Project (`.claude/agents/`) unless user says "personal" |

**Output**: Agent markdown file at `<scope>/agents/<name>.md`.

---

## 5. Output Protocol

After resolving all decisions, follow this sequence:

### Step 1: Confirm Detection
"I detected this as a **[type]** request. Here's what I'll create: ..."

### Step 2: Show Resolved Decisions
Present a table of decisions and resolved values. Example:

> | Decision | Value |
> |----------|-------|
> | Type | skill |
> | Name | code-explainer |
> | Scope | personal (~/.claude/skills/) |
> | allowed-tools | Read, Grep, Glob |
> | user-invocable | true |

"Does this look right? I'll proceed unless you want changes."

### Step 3: Read Reference Docs
For READY types, read the authoritative files now (if not already read).

### Step 4: Write Files
- Write to the source location first (if applicable — e.g., `skills-source/` for this factory project)
- Then deploy to the target location
- For hooks/settings: merge into existing files when present

### Step 5: Summary
Provide:
- **Files created/modified**: absolute paths
- **Key choices made**: the non-obvious decisions
- **Test it**: specific command or prompt to verify the extension works
- **What's next**: any follow-up steps (e.g., "restart Claude Code to pick up the hook")

---

## 6. Graceful Degradation

### Missing Reference Docs
When generating without access to reference documentation:
1. Announce: "Reference docs aren't available — I'll use my training knowledge."
2. Add a comment to generated files: `<!-- Generated without indexed docs — verify against current documentation -->`
3. Include a "Verify" section in the summary listing what to double-check.

### Ambiguous Requests
If the request doesn't clearly map to one type:
- Ask ONE clarifying question with concrete options
- Never guess silently — state your assumption if you proceed

### Multi-Type Requests
Handle sequentially:
1. Detect all types present
2. Announce: "This request involves [N] extensions: [list]. I'll create them one at a time."
3. Run the full DETECT → LOAD → RESOLVE → OUTPUT cycle for each

### Missing Information
If the user's request is too vague to resolve key decisions:
- Fill in sensible defaults
- Flag assumptions in Step 2 (Show Resolved Decisions)
- Let the user override before you write files
