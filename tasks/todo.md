# Current Task: Phase 3 — Validators
**Branch**: `feat/phase-3-validators`
**Started**: 2026-03-13

## Plan

### 3.1 — Extension Auditor (`extension-auditor`)
- [x] Write `skills-source/extension-auditor/SKILL.md`
  - [x] Frontmatter: name, description, disable-model-invocation, allowed-tools (read-only)
  - [x] Section 1: Role & scan targets (~/.claude/skills/, ~/.claude/agents/, settings files)
  - [x] Section 2: Skill validation rules (frontmatter fields, size, description quality)
  - [x] Section 3: Agent validation rules (frontmatter fields, tool profiles, model selection)
  - [x] Section 4: Hook config validation (event names, matcher syntax, handler types)
  - [x] Section 5: Settings validation (deprecated syntax, scope placement, permission rules)
  - [x] Section 6: Cross-extension checks (trigger collisions, naming conflicts)
  - [x] Section 7: Output format (CRITICAL / RECOMMEND / OPTIMIZE severity report)
- [x] Deploy to `~/.claude/skills/extension-auditor/SKILL.md`
- [x] Test against 4 deployed factory skills (cc-factory, cc-ref-hooks, cc-ref-settings, cc-ref-skills)
- [x] Test against agents in ~/.claude/agents/
- [x] Fix any false positives and redeploy — No false positives found

### 3.2 — Upgrade Scanner (`upgrade-scanner`)
- [x] Write `skills-source/upgrade-scanner/SKILL.md`
  - [x] Frontmatter: name, description, disable-model-invocation, allowed-tools (read-only)
  - [x] Section 1: Scan Protocol + reference loading
  - [x] Section 2: Skill upgrade detection (unused features, deprecated patterns)
  - [x] Section 3: Agent upgrade detection (unused features, deprecated patterns)
  - [x] Section 4: Hook upgrade detection (missing events, handler upgrades, matchers)
  - [x] Section 5: Settings upgrade detection (deprecated settings, missing beneficial settings, MCP)
  - [x] Section 6: Cross-extension opportunities (architecture, documentation drift)
  - [x] Section 7: Output format (HIGH / MEDIUM / LOW priority report with before/after)
- [x] Deploy to `~/.claude/skills/upgrade-scanner/SKILL.md`
- [x] Test: scan cc-ref-* skills against fetched_docs for drift
- [x] Fix false positives: added passive-skill skip rule for `user-invocable: false` skills
- [x] Redeploy with fix

## Verification

### Extension Auditor
- [x] YAML frontmatter parses correctly
- [x] Under 500 lines total (270 lines)
- [x] Validation rules match documented schemas (cc-ref-skills, cc-ref-hooks, cc-ref-settings)
- [x] No false positives on correctly-structured factory skills (all 5 skills passed clean)
- [x] Catches real issues in existing agents/skills (14 findings: 8 RECOMMEND, 6 OPTIMIZE)
- [x] No TODO/FIXME left behind

### Upgrade Scanner
- [x] YAML frontmatter parses correctly (4 fields: name, description, disable-model-invocation, allowed-tools)
- [x] Under 500 lines total (295 lines)
- [x] No documentation drift: cc-ref-skills fields match fetched_docs/skills.md (10/10 fields)
- [x] No documentation drift: cc-ref-hooks events match fetched_docs/hooks.md (18/18 events)
- [x] No documentation drift: cc-ref-settings keys match fetched_docs/settings.md (no contradictions)
- [x] All authoritative source paths verified accessible (10/10 paths exist)
- [x] False positives fixed: passive-skill skip rule prevents recommendations for `user-invocable: false` skills
- [x] No TODO/FIXME left behind
- [ ] Diff reviewed: only intended files changed

## Results

**Verification date**: 2026-03-13
**Test scope**: 5 skills, 13 agents, 1 settings file (19 files total)
**Score**: 0 CRITICAL, 8 RECOMMEND, 6 OPTIMIZE

### Key findings in existing agents:
- **Missing skills references**: architect.md references 3 non-existent skills (frontmatter-reference, agent-design-patterns, mcp-catalog)
- **Unknown frontmatter fields**: `background`, `color` fields in several agents — may be valid but undocumented
- **Long agent bodies**: 10 of 13 agents exceed 100-line body recommendation
- **Literal `\n` in descriptions**: 8 agents use `\n` instead of YAML block scalars
- **Trigger overlap**: google-media-generation and sora-video-generator both trigger on "generate video"

### Factory skills — all clean:
- cc-factory: Valid frontmatter, 248 lines, correct allowed-tools
- cc-ref-hooks: Valid frontmatter, user-invocable: false correctly set
- cc-ref-settings: Valid frontmatter, user-invocable: false correctly set
- cc-ref-skills: Valid frontmatter, user-invocable: false correctly set
- extension-auditor: Valid frontmatter, disable-model-invocation: true correctly set

### Upgrade Scanner Results

**Verification date**: 2026-03-13
**Test scope**: 3 cc-ref-* skills scanned against fetched_docs for drift
**Drift detected**: None — all field lists, event lists, and settings keys in sync

**Source doc path verification**: 10/10 paths accessible
- fetched_docs/skills.md, best-practices.md
- fetched_docs/hooks.md, hooks-guide.md
- fetched_docs/settings.md
- processed/Session_8_Schemas.md
- projects/claude-code/plugins/plugin-dev/skills/hook-development/SKILL.md
- projects/claude-code/examples/hooks/, examples/settings/

**False positive fix**: Initial version generated 4 false positives for `user-invocable: false` skills (recommending allowed-tools, hooks, !command, model for passive background-knowledge skills). Added "Skip passive skills" rule to Section 2 to filter these out.

## Session Handoff
<!-- Add if task spans multiple sessions -->
