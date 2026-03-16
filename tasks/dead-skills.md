# Dead Skills / Agents — Disposition Report

**Date**: 2026-03-16
**Phase**: 2 (Structural Fixes)

---

## Investigated Components

### 1. cc-ref-multi-agent (Reference Skill)

**Verdict**: NOT DEAD. Keep as-is.

The routing audit flagged this as orphaned because no router or orchestrator explicitly loads it. However, investigation found it IS referenced by:
- `skills/cc-factory/SKILL.md` (lines 78, 80, 215) — used for multi-agent orchestration guidance
- `agents/subagent-generator.md` (lines 16, 71) — listed in `skills:` field for auto-loading
- `agents/system-architect.md` (line 19) — listed in `skills:` field for auto-loading
- `skills/doc-sync/url-registry.md` (line 23) — mapped to live documentation URLs

The audit's definition of "not referenced by any router" was too narrow. The skill IS loaded via agent `skills:` fields and referenced conditionally by cc-factory. It is functional and reachable.

### 2. doc-sync-checker (Agent)

**Verdict**: NOT DEAD. Already referenced by doc-sync skill.

The routing audit incorrectly stated "The `doc-sync` (sync-docs) skill exists and is user-invocable, but it does NOT reference this agent." However, `skills/doc-sync/SKILL.md` line 34 explicitly says:

> "Spawn the `doc-sync-checker` subagent (`agents/doc-sync-checker.md`)."

And line 87 references it again for error handling. The routing audit missed these references because the skill's frontmatter `name` was `sync-docs` (now fixed to `doc-sync`), which may have caused confusion during the audit.

The agent is reachable via `/sync-docs` (now `/doc-sync`) and is correctly listed in the README.

### 3. agent-quality-reviewer (Agent)

**Verdict**: POTENTIALLY DEAD — needs Phase 4 wiring.

This agent exists on disk and is listed in the README under Dev Team Factory specialist agents, but:
- No skill in `skills/` references it
- `agent-factory/SKILL.md` does not dispatch to it post-generation
- No routing path reaches it

It appears designed to validate agent files after `agent-factory` generates them, analogous to how `extension-validator` validates extension files after generation. However, the wiring was never connected.

**Recommended Phase 4 action**: When `dev-team-concierge` is built, add a post-generation step that dispatches to `agent-quality-reviewer` for validation, mirroring the extension-concierge -> extension-validator pattern.

For now, it remains on disk and in the README as a Dev Team Factory component awaiting its orchestrator.
