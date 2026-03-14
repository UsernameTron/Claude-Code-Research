# Current Task: Phase 7 — Authoritative Knowledge Alignment
**Branch**: `feat/phase-7-knowledge-alignment`
**Started**: 2026-03-14
**Status**: COMPLETE

## Context

Anthropic's official multi-agent/subagent documentation (early 2026 compilation) was compared
against all 6 reference skills, 3 agents, 2 routers, and 7 generators in the plugin.
Current alignment: **~42% on frontmatter conformance, ~70% on reference content coverage**.

Key finding: The reference skills are the knowledge backbone — generators and agents consult
them to produce output. Every gap in reference knowledge propagates to every generated artifact.

---

## Phase A: Reference Skill Enrichment (Foundation)

### A1. cc-ref-subagents — Add Agent SDK + Enrich Agent Teams + New Fields
- [ ] Add **Agent SDK section**: `query()` function, `ClaudeAgentOptions`, `ClaudeSDKClient`,
      programmatic subagent definition via `agents` parameter, `@tool` decorator,
      `create_sdk_mcp_server()`, `settingSources` for CLAUDE.md loading
- [ ] Enrich **Agent Teams section**: environment flag (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`),
      5 tools (`TeamCreate`, `TaskCreate`, `TaskUpdate`, `TaskList`, `SendMessage`),
      7× token usage warning, known limitations (no resume, status lag, premature completion),
      requires v2.1.32+
- [ ] Add **`color` frontmatter field** to the All Frontmatter Fields table
- [ ] Add **context isolation details**: subagents get fresh conversation, receive only their
      markdown body + basic environment (NOT full Claude Code system prompt, NOT CLAUDE.md),
      parent passes info via Agent tool prompt string, only final message returns
- [ ] Reconcile **built-in agents list** (current skill shows 5, document shows 3 — verify
      which are official built-ins vs derived)
- [ ] Add **"handoff" mechanism note**: Agent tool (renamed from "Task" in v2.1.63),
      programmatic agents take precedence over filesystem-based agents with same name
- [ ] Add **guardrails triad**: permission modes + tool allow/deny lists + hooks work together

### A2. cc-ref-skills — Add CLAUDE.md Behavior + Rules Directory
- [ ] Add **CLAUDE.md `@import` syntax**: `@path/to/import` for including additional files,
      recursive to 5 hops
- [ ] Add **`.claude/rules/` directory**: topic-specific rules with optional YAML frontmatter
      containing `paths` globs for conditional loading
- [ ] Add **CLAUDE.md hierarchy**: Managed → User → Project → Ancestor → Subdirectory,
      with precedence and scope descriptions
- [ ] Add **CLAUDE.md loading behavior**: loaded as user message (not system prompt),
      survives context compaction by being re-read from disk
- [ ] Add **subagent CLAUDE.md isolation**: subagents do NOT inherit CLAUDE.md content,
      must read it via Read tool if granted access
- [ ] Add **SDK CLAUDE.md loading**: only loaded when `settingSources: ["project"]` is
      explicitly configured; `claude_code` preset does not auto-load it

### A3. cc-ref-settings — Add Memory + Session Persistence + Compaction
- [ ] Add **Auto Memory section**: v2.1.59+, Claude decides what to remember (build commands,
      debugging insights, architecture notes, code style), stored as plain markdown,
      browsable via `/memory`, toggle with `/memory` or `autoMemoryEnabled` setting
- [ ] Add **Session Persistence section**: full conversation history as `.jsonl` files in
      `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl`, resume via `--continue` or
      `--resume`, fork support for branching, SDK adds file checkpointing and rewind
- [ ] Add **Context Compaction section**: when approaching token limits, Claude summarizes
      conversation and reinjects CLAUDE.md fresh, recommend saving progress/state to memory
      before compaction occurs

### A4. cc-ref-plugins — Add Marketplace + Reference Plugins + Config
- [ ] Add **Marketplace CLI commands**: `/plugin marketplace add`, `/plugin install`,
      `/plugin uninstall`
- [ ] Add **Official marketplace repo**: `github.com/anthropics/claude-plugins-official`
- [ ] Add **Reference plugins** from official repo: code review plugin (5 parallel Sonnet
      agents), feature development plugin (explorer/architect/reviewer agents), Agent SDK
      development plugin (`/new-sdk-app`), plugin development toolkit (8-phase workflow)
- [ ] Add **`enabledPlugins` config**: JSON structure for per-plugin enablement
- [ ] Add **`extraKnownMarketplaces` config**: JSON structure for custom marketplace sources
- [ ] Add **component types** if missing: output-styles, LSP servers alongside existing types

### A5. cc-ref-hooks — Add Guardrails Context
- [ ] Add **Guardrails triad note**: hooks are one of three guard systems alongside
      permission modes and tool allow/deny lists
- [ ] Add **SDK hooks integration**: typed callbacks at lifecycle points including
      `PreToolUse` (can deny execution), `PostToolUse`, `SubagentStart`, `Notification`,
      `UserPromptSubmit`
- [ ] Verify **18 hook events** match document list (cross-check: SessionStart,
      InstructionsLoaded, UserPromptSubmit, PreToolUse, PermissionRequest, PostToolUse,
      PostToolUseFailure, Stop, SubagentStart, SubagentStop, TeammateIdle, TaskCompleted,
      ConfigChange, WorktreeCreate, WorktreeRemove, Notification, PreCompact, SessionEnd)

---

## Phase B: New Reference Skill — Multi-Agent Guidance

### B1. Create `cc-ref-multi-agent/SKILL.md`
- [ ] New reference skill: `user-invocable: false`, background knowledge
- [ ] **Three-part gate** for going multi-agent: context pollution degrades performance,
      tasks can run in parallel, specialization improves tool selection/focus
- [ ] **Five orchestration patterns** (from "Building Effective Agents"):
      prompt chaining → routing → parallelization → orchestrator-workers → evaluator-optimizer
- [ ] **Context-centric decomposition**: divide by context boundaries (feature agent handles
      its own tests), NOT by task type (separate write/test/review agents)
- [ ] **Token economics**: multi-agent uses 3–10× more tokens, research systems 15× more
      than chat, agents use ~4× more than chat — reserve for high-value tasks
- [ ] **Eight prompt engineering principles** for multi-agent (from research system post):
      think like agents, teach orchestrator to delegate, scale effort to complexity, design
      tools carefully, let agents self-improve, start wide then narrow, guide thinking, leverage
      parallel tool calling
- [ ] **Verification subagent pattern**: called out as consistently effective because
      verification requires minimal context transfer
- [ ] Add to plugin.json keywords, README skill count

---

## Phase C: Frontmatter Modernization (Agents + Key Skills)

### C1. Agent Frontmatter Updates
- [ ] **hook-engineer.md**: Add `memory: project` (remembers hook patterns across sessions),
      consider `isolation: "worktree"` (generates code)
- [ ] **plugin-builder.md**: Add `memory: project` (remembers plugin structures),
      add `isolation: "worktree"` (creates full plugin directories)
- [ ] **extension-validator.md**: Add `memory: project` (remembers prior audit findings),
      already has `permissionMode: plan` (good, read-only)

### C2. Router/Orchestrator Skill Frontmatter
- [ ] **extension-guide**: Add `user-invocable: true` (or false if purely auto-triggered),
      add `argument-hint` for intent description
- [ ] **extension-concierge**: Add `user-invocable: true`, add `argument-hint`,
      consider adding `allowed-tools` to scope what the orchestrator can do

### C3. Generator Skill Frontmatter
- [ ] **skill-factory**: Add `user-invocable: true` (explicit), add `skills:` array
      to preload `cc-ref-skills` in frontmatter instead of body-only reference
- [ ] **hook-factory**: Add `user-invocable: true`, add `skills:` array for `cc-ref-hooks`
- [ ] **All 7 generators**: Verify each has `allowed-tools` declared (currently only
      skill-factory and hook-factory do)
- [ ] **All generators**: Consider adding `model: sonnet` for output consistency

---

## Phase D: Generator Template Updates (Propagate New Knowledge)

### D1. skill-factory Template Modernization
- [ ] Update the SKILL.md template/example to include ALL modern frontmatter fields:
      `name`, `description`, `argument-hint`, `disable-model-invocation`, `user-invocable`,
      `allowed-tools`, `model`, `context`, `agent`, `hooks`
- [ ] Add guidance on when to use `context: fork` vs default
- [ ] Add `.claude/rules/` awareness — when generating project-level skills, note the
      rules directory option

### D2. hook-factory Template Modernization
- [ ] Verify all **18 hook events** are in the intent-to-event mapping table
- [ ] Add `prompt` and `agent` handler types if not already present
- [ ] Update examples to show guardrails triad integration

### D3. Subagent-Adjacent Generator Updates
- [ ] **cc-factory**: Update the unified factory to reference `cc-ref-multi-agent` when
      generating complex multi-component systems
- [ ] **plugin-packager**: Verify it knows about `output-styles/` and `lsp.json` component
      types
- [ ] **mcp-configurator**: Verify awareness of subagent `mcpServers` frontmatter field
- [ ] **settings-architect**: Add `autoMemoryEnabled`, `enabledPlugins`,
      `extraKnownMarketplaces` to known settings categories

---

## Phase E: Validation & Versioning

- [ ] **Frontmatter parse check**: All 19 skills (18 + 1 new) YAML parses correctly
- [ ] **Agent frontmatter check**: All 3 agents YAML parses correctly
- [ ] **No local paths**: grep entire `skills/` and `agents/` for absolute paths
- [ ] **Cross-reference consistency**: every skill referenced by name in another skill
      actually exists
- [ ] **No orphaned content**: no TODO/FIXME/HACK comments left behind
- [ ] **plugin.json**: Bump version to 1.3.0, update description and keywords for new skill
- [ ] **README.md**: Update skill count (19), add cc-ref-multi-agent to reference skill list
- [ ] **Diff review**: `git diff --staged` before every commit — only intended files changed

---

## Verification Checklist (All Must Pass Before Done)
- [ ] All 19 skill frontmatters parse as valid YAML
- [ ] All 3 agent frontmatters parse as valid YAML
- [ ] No local file paths in any skill or agent
- [ ] plugin.json is valid JSON with bumped version
- [ ] README reflects accurate component counts
- [ ] Generator templates produce output with modern frontmatter fields
- [ ] Cross-references between skills are consistent (no broken names)
- [ ] No TODO/FIXME/HACK left behind

---

## Scope & Effort Estimates

| Phase | Files Touched | Complexity | Dependency |
|-------|--------------|------------|------------|
| A (Reference Enrichment) | 5 SKILL.md files | Medium — additive content, no restructuring | None |
| B (New Reference Skill) | 1 new SKILL.md + plugin.json + README | Medium — new file from authoritative source | Phase A (for consistency) |
| C (Frontmatter Modernization) | 3 agents + 2 routers + 7 generators = 12 files | Low — YAML field additions only | Phase A (fields must be documented first) |
| D (Generator Templates) | 5-7 SKILL.md bodies | Medium — template sections need careful editing | Phase A + B (new knowledge must exist first) |
| E (Validation) | 0 new files, verify all | Low — verification pass | All above |

**Total files**: ~25 modified, 1 new
**Estimated commits**: 5 (one per phase)
**Risk**: Low — all changes are additive (enriching content, adding fields). No deletions, no restructuring, no dependency changes.

---

## Results

Phase 7 completed across 5 commits on `feat/phase-7-knowledge-alignment`:

| Phase | Commit | Summary |
|-------|--------|---------|
| A | `932cc9b` | Enriched 5 reference skills with authoritative content from Anthropic docs |
| B | `866fc13` | Created cc-ref-multi-agent (orchestration patterns, token economics, three-part gate) |
| C | `d6621de` | Modernized frontmatter on 9 skills (user-invocable, skills preloading, argument-hint) |
| D | `25b583e` | Updated 7 generator templates (all 10 frontmatter fields, 18 hook events, new settings) |
| E | _(this commit)_ | Validated 22 files, bumped to v1.3.0, updated README |

Verification: 22/22 frontmatters valid, 0 broken cross-references, 0 orphaned markers, 0 real local paths.

---

## Session Handoff
Phase 7 complete. Branch ready for merge to main.

---

## Previous Task (Archived)
Phase 6 — Compound Architecture (Layer 0/1/2) — COMPLETE (2026-03-13)
See `tasks/archive/phase-6.md` for details.
