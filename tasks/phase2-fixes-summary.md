# Phase 2 Fixes Summary

**Date**: 2026-03-16
**Audit sources**: `tasks/audit-frontmatter.md`, `tasks/audit-routing.md`, `tasks/audit-content.md`

---

## Fixes Applied

### Frontmatter Fixes (3)

| # | File | Change |
|---|------|--------|
| 1 | `skills/doc-sync/SKILL.md` | Changed `name: sync-docs` to `name: doc-sync` to match directory name |
| 2 | `downloads/eval-harness/SKILL.md` | Renamed field `tools` to `allowed-tools` (correct SKILL.md field name) |
| 3 | `skills/extension-guide/SKILL.md` | Removed `argument-hint` field (contradicts `user-invocable: false`) |

### Broken Reference Fix (1)

| # | File | Change |
|---|------|--------|
| 7 | `skills/agent-factory/SKILL.md` | Added "(planned Phase 4 addition -- not yet built)" note to `dev-team-concierge` reference |

### Documentation Staleness Fixes (2)

| # | File | Change |
|---|------|--------|
| 9 | `CLAUDE.md` | Updated Project-Specific Rules: skills count from "18 skills" to "33 skills" with breakdown; agents count from "3 specialist subagents" to "10 specialist subagents" with breakdown |
| 10 | `README.md` | Added 3 undocumented agents to Extension Factory Specialist Agents table: recommendation-engine, system-architect, subagent-generator |

### README Future References (1 — no change needed)

| # | File | Decision |
|---|------|----------|
| 8 | `README.md` | `dev-team-guide` and `dev-team-concierge` correctly marked "(future)" in architecture diagram. Left as-is for Phase 4. |

---

## Dead Skills Investigation (3)

Investigated and documented in `tasks/dead-skills.md`:

| # | Component | Verdict |
|---|-----------|---------|
| 4 | `cc-ref-multi-agent` | NOT DEAD. Referenced by cc-factory, subagent-generator (skills: field), and system-architect (skills: field). The routing audit missed these references. |
| 5 | `doc-sync-checker` agent | NOT DEAD. Referenced by `skills/doc-sync/SKILL.md` lines 34 and 87. The routing audit missed this because the skill's name was `sync-docs` (now fixed). |
| 6 | `agent-quality-reviewer` agent | POTENTIALLY DEAD. No skill dispatches to it. Designed for post-generation validation but never wired. Awaits Phase 4 `dev-team-concierge` to provide routing. Left on disk. |

---

## Signal Phrase Overlap (1 — documented only)

| # | File Created | Content |
|---|-------------|---------|
| 11 | `tasks/signal-phrase-overlap.md` | Documents three-way overlap between extension-guide, extension-concierge, and cc-factory. Proposes resolution options for Phase 4. No routing changes made. |

---

## Files Modified

1. `skills/doc-sync/SKILL.md` — frontmatter name fix
2. `downloads/eval-harness/SKILL.md` — frontmatter field rename
3. `skills/extension-guide/SKILL.md` — removed contradictory argument-hint
4. `skills/agent-factory/SKILL.md` — annotated future dependency
5. `CLAUDE.md` — updated skill/agent counts
6. `README.md` — added 3 missing agents

## Files Created

7. `tasks/dead-skills.md` — disposition report for 3 investigated components
8. `tasks/signal-phrase-overlap.md` — Phase 4 planning document
9. `tasks/phase2-fixes-summary.md` — this file
