# Current Task: Beginner Experience v1.7 (4 Plans Merged)
**Branch**: `feat/beginner-experience-v1.7`
**Started**: 2026-03-16

## Plan

### Setup
- [ ] Merge feat/foundation-v1.5 → main
- [ ] Create branch feat/beginner-experience-v1.7 from main

### Part 1 — Scenario Library (40 lean recipes)
- [ ] Step 1: mkdir -p skills/scenario-library/recipes
- [ ] Step 2: Create recipes/automation.md (12 hook recipes A01-A12)
- [ ] Steps 3-6: Create commands.md (8), knowledge.md (5), specialists.md (5), connections.md (5), security.md (5)
- [ ] Step 7: Create skills/scenario-library/SKILL.md (browser + matcher)
- [ ] Commit batch: recipes + SKILL.md

### Part 2 — Smart Scaffold (merged scaffolding + progressive disclosure)
- [ ] Step 8: mkdir dirs
- [ ] Step 9: Create 3 question flow files (timing, scope, behavior)
- [ ] Step 10: Create tier-classifier.md (from progressive disclosure plan)
- [ ] Step 11: Create skills/smart-scaffold/SKILL.md (merged skill)
- [ ] Step 12: Update intent-engine SKILL.md (delegate to smart-scaffold)

### Part 3 — One-Shot Install
- [ ] Step 13: mkdir dirs
- [ ] Step 14: Create 3 supporting files (install-paths, merge-strategies, verification-tests)
- [ ] Step 15: Create skills/extension-installer/SKILL.md
- [ ] Step 16: Add install offer to all 7 generators (parallel)
- [ ] Step 17: Update extension-guide CREATE routing (tier governance via smart-scaffold)
- [ ] Step 18: Bump plugin.json to 1.7.0

## Verification
- [ ] 40 recipes across 6 files, each under 20 lines
- [ ] /recipes skill is user-invocable with 4 modes
- [ ] smart-scaffold has question flows + tier classifier
- [ ] Intent engine delegates to smart-scaffold on MEDIUM/LOW confidence
- [ ] /install skill handles all 7 extension types
- [ ] All 7 generators offer installation after generation
- [ ] Extension-guide CREATE route goes through tier governance
- [ ] plugin.json version is "1.7.0"
