# Current Task: Phase 5 — Plugin Packaging
**Branch**: `feat/phase-5-plugin`
**Started**: 2026-03-13
**Plan**: `plans/2026-03-13-phase-5-plugin-packaging.md`

## Plan
- [ ] Step 0: Archive Phase 4, write Phase 5 todo, create branch
- [ ] Step 1: Rename `skills-source/` → `skills/`, `agents-source/` → `agents/`, update CLAUDE.md
- [ ] Step 2: Make all 14 skills portable (remove local file paths)
- [ ] Step 3: Create `.claude-plugin/plugin.json` manifest
- [ ] Step 4: Create `README.md`
- [ ] Step 5: Validate frontmatter, verify no local paths, deploy portable versions

## Verification
- [ ] All 16 skills have valid YAML frontmatter
- [ ] All 3 agents have valid YAML frontmatter
- [ ] No local file paths (`~/Desktop/Claude Code Research/`) in `skills/` or `agents/`
- [ ] `.claude-plugin/plugin.json` is valid JSON with required `name` field
- [ ] README.md exists with installation instructions
- [ ] CLAUDE.md updated with new directory names and retired deploy workflow
- [ ] Deployed copies at `~/.claude/skills/` and `~/.claude/agents/` updated with portable versions

## Results
<!-- Add after completion -->

## Session Handoff
<!-- Add if task spans multiple sessions -->
