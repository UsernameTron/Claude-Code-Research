# Frontmatter Audit Report

**Date**: 2026-03-16
**Scope**: All `skills/*/SKILL.md` and `agents/*.md` files in `/Users/cpconnor/projects/claude-code-factory`

---

## Summary

| Metric | Count |
|--------|-------|
| Total files scanned | 47 |
| SKILL.md files | 37 |
| Agent .md files | 10 |
| **Pass** | **44** |
| **Fail** | **3** |

---

## Failures

### 1. skills/doc-sync/SKILL.md

- **Error**: Name-directory mismatch. Frontmatter `name: sync-docs` does not match directory name `doc-sync`.
- **Rule**: The `name` field must match the enclosing directory name.
- **Suggested fix**: Change `name: sync-docs` to `name: doc-sync`.

### 2. downloads/eval-harness/SKILL.md

- **Error**: Unrecognized frontmatter field `tools`. Valid SKILL.md fields are: `name`, `description`, `argument-hint`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `model`, `context`, `agent`, `hooks`.
- **Rule**: Tool restrictions in SKILL.md use the `allowed-tools` field, not `tools`.
- **Suggested fix**: Rename field from `tools` to `allowed-tools`.

### 3. skills/extension-guide/SKILL.md

- **Error**: Contradictory frontmatter. Has `argument-hint: "<describe what you want to build, audit, upgrade, or package>"` but also `user-invocable: false`. The `argument-hint` field is only meaningful for user-invocable skills.
- **Rule**: `argument-hint` should only appear when `user-invocable` is `true` (or omitted, since it defaults to `true`).
- **Suggested fix**: Remove the `argument-hint` field since the skill is not user-invocable.

---

## Full Results Table

| # | File | Type | Status | Notes |
|---|------|------|--------|-------|
| 1 | skills/agent-factory/SKILL.md | skill | PASS | |
| 2 | skills/cc-ref-agent-archetypes/SKILL.md | skill | PASS | |
| 3 | skills/cc-ref-cli/SKILL.md | skill | PASS | |
| 4 | skills/cc-ref-config/SKILL.md | skill | PASS | |
| 5 | skills/cc-ref-hooks/SKILL.md | skill | PASS | |
| 6 | skills/cc-ref-sdk/SKILL.md | skill | PASS | |
| 7 | skills/cc-ref-skills/SKILL.md | skill | PASS | |
| 8 | skills/claude-code-intro/SKILL.md | skill | PASS | |
| 9 | skills/claude-code-quickstart/SKILL.md | skill | PASS | |
| 10 | skills/doc-sync/SKILL.md | skill | FAIL | name-directory mismatch |
| 11 | skills/extension-guide/SKILL.md | skill | FAIL | contradictory argument-hint |
| 12 | skills/hook-factory/SKILL.md | skill | PASS | |
| 13 | skills/hook-validator/SKILL.md | skill | PASS | |
| 14 | skills/mcp-builder/SKILL.md | skill | PASS | |
| 15 | skills/plugin-architect/SKILL.md | skill | PASS | |
| 16 | skills/plugin-builder/SKILL.md | skill | PASS | |
| 17 | skills/plugin-validator/SKILL.md | skill | PASS | |
| 18 | skills/prompt-engineer/SKILL.md | skill | PASS | |
| 19 | skills/router/SKILL.md | skill | PASS | |
| 20 | skills/settings-factory/SKILL.md | skill | PASS | |
| 21 | skills/skill-factory/SKILL.md | skill | PASS | |
| 22 | skills/skill-validator/SKILL.md | skill | PASS | |
| 23 | skills/team-combo-engine/SKILL.md | skill | PASS | |
| 24 | skills/team-configurator/SKILL.md | skill | PASS | |
| 25 | skills/team-installer/SKILL.md | skill | PASS | |
| 26 | skills/team-registry/SKILL.md | skill | PASS | |
| 27 | skills/team-blueprint-template/SKILL.md | skill | PASS | |
| 28 | skills/workflow-factory/SKILL.md | skill | PASS | |
| 29 | skills/debug-guide/SKILL.md | skill | PASS | |
| 30 | skills/troubleshooter/SKILL.md | skill | PASS | |
| 31 | skills/command-reference/SKILL.md | skill | PASS | |
| 32 | skills/best-practices/SKILL.md | skill | PASS | |
| 33 | skills/migration-guide/SKILL.md | skill | PASS | |
| 34 | downloads/eval-harness/SKILL.md | skill | FAIL | uses `tools` instead of `allowed-tools` |
| 35 | downloads/frontend-design/SKILL.md | skill | PASS | |
| 36 | downloads/tdd/SKILL.md | skill | PASS | |
| 37 | downloads/brainstorming/SKILL.md | skill | PASS | |
| 38 | agents/hook-engineer.md | agent | PASS | |
| 39 | agents/plugin-builder.md | agent | PASS | |
| 40 | agents/doc-sync-checker.md | agent | PASS | |
| 41 | agents/extension-validator.md | agent | PASS | |
| 42 | agents/subagent-generator.md | agent | PASS | |
| 43 | agents/recommendation-engine.md | agent | PASS | |
| 44 | agents/system-architect.md | agent | PASS | |
| 45 | agents/team-architect.md | agent | PASS | |
| 46 | agents/agent-quality-reviewer.md | agent | PASS | |
| 47 | agents/stack-analyzer.md | agent | PASS | |

---

## Validation Rules Applied

### SKILL.md checks
- Frontmatter present (valid YAML between `---` fences)
- `name`: required, kebab-case, ≤64 chars, matches directory name
- `description`: required, ≤1024 chars
- `user-invocable`: boolean if present
- `model`: valid enum (`sonnet`, `opus`, `haiku`, `inherit`) if present
- Only recognized frontmatter fields used
- Body is non-empty with at least one heading
- No contradictory field combinations

### Agent .md checks
- Frontmatter present (valid YAML between `---` fences)
- `name`: required, kebab-case
- `description`: required, non-empty
- `model`: valid enum (`sonnet`, `opus`, `haiku`, `inherit`) if present
- `tools`: string (CSV format) if present
- `permissionMode`: valid enum if present
