# Current Task: Phase 2 — Specialized Generators
**Branch**: `feat/phase-2-generators`
**Started**: 2026-03-13

## Plan

### 2.1 — Skill Factory (`skill-factory`)
- [x] Write `skills-source/skill-factory/SKILL.md`
  - [x] Frontmatter: name, description, allowed-tools
  - [x] Section 1: Role & auto-resolution workflow
  - [x] Section 2: Frontmatter field resolution (all 11 documented fields)
  - [x] Section 3: Body structure guidance (progressive disclosure, size limits)
  - [x] Section 4: Output protocol (file paths, testing steps)
  - [x] Reference loading: cc-ref-skills
- [x] Deploy to `~/.claude/skills/skill-factory/SKILL.md`
- [ ] Test: "create a skill that validates JSON schemas"

### 2.2 — Hook Factory (`hook-factory`)
- [x] Write `skills-source/hook-factory/SKILL.md`
  - [x] Frontmatter: name, description, allowed-tools
  - [x] Section 1: Role & workflow (detect → load → resolve → output)
  - [x] Section 2: Intent-to-event mapping
  - [x] Section 3: Handler type selection (command, http, prompt, agent)
  - [x] Section 4: Auto-resolution engine (event, matcher, handler, blocking, scope)
  - [x] Section 5: Output protocol (JSON config, script files, merge behavior, test steps)
  - [x] Reference loading: cc-ref-hooks
- [x] Deploy to `~/.claude/skills/hook-factory/SKILL.md`
- [ ] Test: "create a hook that blocks rm -rf commands"

### 2.3 — Plugin Packager (`plugin-packager`)
- [x] Write `skills-source/plugin-packager/SKILL.md`
  - [x] Frontmatter: name, description, allowed-tools
  - [x] Section 1: Role & packaging workflow
  - [x] Section 2: Manifest schema resolution (plugin.json fields)
  - [x] Section 3: Directory structure generation
  - [x] Section 4: Component migration (existing skills/agents/hooks → plugin)
  - [x] Reference loading: plugins-reference.md (authoritative source)
- [x] Deploy to `~/.claude/skills/plugin-packager/SKILL.md`
- [ ] Test: "package my code-reviewer agent into a plugin"

### 2.4 — MCP Configurator (`mcp-configurator`)
- [x] Write `skills-source/mcp-configurator/SKILL.md`
  - [x] Frontmatter: name, description, allowed-tools
  - [x] Section 1: Role & configuration workflow
  - [x] Section 2: Transport type resolution (HTTP over SSE)
  - [x] Section 3: Scope & auth resolution (OAuth, API keys, env vars)
  - [x] Section 4: Output protocol (.mcp.json or CLI commands)
  - [x] Reference loading: mcp.md (authoritative source)
- [x] Deploy to `~/.claude/skills/mcp-configurator/SKILL.md`
- [ ] Test: "connect to a PostgreSQL database via MCP"

### 2.5 — Settings Architect (`settings-architect`)
- [x] Write `skills-source/settings-architect/SKILL.md`
  - [x] Frontmatter: name, description, allowed-tools
  - [x] Section 1: Role & settings workflow
  - [x] Section 2: Scope resolution (user/project/local/managed)
  - [x] Section 3: Permission rule syntax builder
  - [x] Section 4: Sandbox, model, env configuration
  - [x] Reference loading: cc-ref-settings
- [x] Deploy to `~/.claude/skills/settings-architect/SKILL.md`
- [ ] Test: "create settings that lock to Sonnet and block curl"

### 2.6 — CI/CD Pipeline Generator (`cicd-generator`)
- [x] Write `skills-source/cicd-generator/SKILL.md`
  - [x] Frontmatter: name, description, allowed-tools
  - [x] Section 1: Role & pipeline workflow
  - [x] Section 2: Platform resolution (GitHub Actions, GitLab)
  - [x] Section 3: Claude Code action configuration
  - [x] Section 4: Output protocol (workflow YAML, secrets, test steps)
  - [x] Reference loading: github-actions.md, gitlab-ci-cd.md, headless.md
- [x] Deploy to `~/.claude/skills/cicd-generator/SKILL.md`
- [ ] Test: "create a GitHub Action that reviews PRs with Claude"

### 2.7 — Output Style Creator (`output-style-creator`)
- [x] Write `skills-source/output-style-creator/SKILL.md`
  - [x] Frontmatter: name, description, allowed-tools
  - [x] Section 1: Role & style creation workflow
  - [x] Section 2: Tone/format/audience resolution
  - [x] Section 3: Output style vs system prompt vs CLAUDE.md distinction
  - [x] Section 4: Output protocol (style file with frontmatter)
  - [x] Reference loading: output-styles.md
- [x] Deploy to `~/.claude/skills/output-style-creator/SKILL.md`
- [ ] Test: "create an output style for executive briefings"

## Verification
- [x] All 7 skills have valid YAML frontmatter
- [x] All skills under 500 lines (max: 304, min: 163)
- [x] Each skill references its authoritative doc source correctly
- [x] No TODO/FIXME left behind
- [ ] Each skill tested with at least one generation request
- [x] Diff reviewed: all 7 source/deploy pairs identical

## Results

**Build date**: 2026-03-13
**All 7 generators written and deployed:**

| Skill | Lines | Reference Source |
|-------|-------|-----------------|
| hook-factory | 304 | cc-ref-hooks |
| skill-factory | 218 | cc-ref-skills |
| cicd-generator | 212 | github-actions.md, gitlab-ci-cd.md, headless.md |
| output-style-creator | 225 | output-styles.md |
| plugin-packager | 179 | plugins-reference.md |
| mcp-configurator | 176 | mcp.md |
| settings-architect | 163 | cc-ref-settings |

**All deploy diffs**: identical (7/7)
**All frontmatter**: valid YAML, correct names

## Session Handoff

All 7 Phase 2 generators are written and deployed. Remaining work:
- Behavioral testing of each skill in a new session
- Commit to `feat/phase-2-generators` branch
