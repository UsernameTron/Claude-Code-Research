# Current Task: Phase 4 — Specialist Subagents
**Branch**: `feat/phase-4-subagents`
**Started**: 2026-03-13

## Plan

### Prerequisites: Missing Reference Skills (cc-ref-permissions, cc-ref-plugins, cc-ref-subagents)

Phase 4 agents reference 6 reference skills via the `skills` field. Only 3 exist
(cc-ref-hooks, cc-ref-settings, cc-ref-skills). Build the missing 3 first.

#### 0.A — cc-ref-permissions
- [ ] Write `skills-source/cc-ref-permissions/SKILL.md`
  - [ ] Quick Reference: permission rule syntax, pattern matching, mode descriptions
  - [ ] Authoritative Sources: permissions.md, Session_8_Schemas.md
- [ ] Deploy to `~/.claude/skills/cc-ref-permissions/SKILL.md`

#### 0.B — cc-ref-plugins
- [ ] Write `skills-source/cc-ref-plugins/SKILL.md`
  - [ ] Quick Reference: plugin.json fields, directory structure, component types
  - [ ] Authoritative Sources: plugins.md, plugins-reference.md, plugin-marketplaces.md, discover-plugins.md
- [ ] Deploy to `~/.claude/skills/cc-ref-plugins/SKILL.md`

#### 0.C — cc-ref-subagents
- [ ] Write `skills-source/cc-ref-subagents/SKILL.md`
  - [ ] Quick Reference: frontmatter fields, built-in agent types, nesting constraint
  - [ ] Authoritative Sources: sub-agents.md, agent-teams.md
- [ ] Deploy to `~/.claude/skills/cc-ref-subagents/SKILL.md`

### 4.1 — Hook Engineer (`hook-engineer`)
- [ ] Write `agents-source/hook-engineer.md`
  - [ ] Frontmatter: name, description, tools, model, maxTurns, skills
  - [ ] System prompt: multi-event coordination, complex hook systems
  - [ ] Skills: cc-ref-hooks, cc-ref-permissions, cc-ref-settings
- [ ] Deploy to `~/.claude/agents/hook-engineer.md`
- [ ] Test: "Design a coaching enforcement system using PreToolUse + PostToolUse + Stop"

### 4.2 — Plugin Builder (`plugin-builder`)
- [ ] Write `agents-source/plugin-builder.md`
  - [ ] Frontmatter: name, description, tools, model, permissionMode, maxTurns, skills
  - [ ] System prompt: complete plugin creation with all components
  - [ ] Skills: cc-ref-plugins, cc-ref-skills, cc-ref-hooks
- [ ] Deploy to `~/.claude/agents/plugin-builder.md`
- [ ] Test: "Create a complete code-quality plugin with linting hooks and a review agent"

### 4.3 — Extension Validator (`extension-validator`)
- [ ] Write `agents-source/extension-validator.md`
  - [ ] Frontmatter: name, description, tools, disallowedTools, model, permissionMode, maxTurns, skills
  - [ ] System prompt: read-only validation, compliance reports
  - [ ] Skills: cc-ref-hooks, cc-ref-settings, cc-ref-permissions, cc-ref-plugins, cc-ref-skills, cc-ref-subagents
- [ ] Deploy to `~/.claude/agents/extension-validator.md`
- [ ] Test: "Validate all skills in ~/.claude/skills/ against official schemas"

## Verification
- [ ] All 3 reference skills have valid YAML frontmatter
- [ ] All 3 agents have valid YAML frontmatter
- [ ] Each agent's `skills` field references only existing skills
- [ ] Source/deploy pairs are identical (6 files: 3 skills + 3 agents)
- [ ] Each agent tested with at least one invocation
- [ ] No TODO/FIXME left behind

## Results
<!-- Add after completion -->

## Session Handoff
<!-- Add if task spans multiple sessions -->
