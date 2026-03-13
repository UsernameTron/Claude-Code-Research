# Archived Task: Phase 0 — Critical Reference Skills
**Branch**: `feat/phase-0-reference-skills`
**Started**: 2026-03-13
**Completed**: 2026-03-13

## Plan
- [x] Customize CLAUDE.md Project-Specific Rules for factory project
- [x] Create cc-ref-hooks reference skill
  - [x] Write to skills-source/cc-ref-hooks/SKILL.md
  - [x] Deploy to ~/.claude/skills/cc-ref-hooks/SKILL.md
  - [x] Test: ask a hooks question, verify doc reading
- [x] Create cc-ref-settings reference skill
  - [x] Write to skills-source/cc-ref-settings/SKILL.md
  - [x] Deploy to ~/.claude/skills/cc-ref-settings/SKILL.md
  - [x] Test: ask a settings question, verify doc reading
- [x] Create cc-ref-skills reference skill
  - [x] Write to skills-source/cc-ref-skills/SKILL.md
  - [x] Deploy to ~/.claude/skills/cc-ref-skills/SKILL.md
  - [x] Test: ask a skills question, verify doc reading

## Verification
- [x] All 3 skills have valid YAML frontmatter
- [x] All 3 skills follow the 0.3 template (Quick Reference + Authoritative Sources)
- [x] Quick Reference tables are compact (<50 lines each)
- [x] File paths in Authoritative Sources are absolute and correct
- [x] Each skill triggers on its domain keywords (test with natural language)
- [x] No TODO/FIXME left behind

## Results
All 3 behavioral tests passed — skills auto-trigger on domain keywords and read authoritative source docs.
