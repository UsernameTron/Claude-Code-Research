# Signal Phrase Overlap — Phase 4 Resolution Needed

**Date**: 2026-03-16
**Status**: Documented for Phase 4. No routing changes made.

---

## Problem

Three skills all claim overlapping creation triggers in their `description` fields:

| Skill | User-Invocable | Role |
|-------|---------------|------|
| `extension-guide` | No (invisible router) | Layer 0 entry point |
| `extension-concierge` | Yes | Layer 1 orchestrator |
| `cc-factory` | Yes | Layer 2 generator |

### Overlapping Trigger Phrases

These phrases appear in the descriptions of all three:
- "create a skill" / "build a plugin" / "I need a hook"
- "set up CI/CD" / "configure MCP"
- "output style"
- "create an agent" / "subagent"
- "package" / "bundle" / "distribute" / "marketplace"

### Impact

When Claude sees a creation request, skill selection may route directly to `cc-factory` instead of going through the intended chain: `extension-guide` -> `extension-concierge` -> generator. Direct routing to `cc-factory` bypasses:
- Tier classification (smart-scaffold)
- Intent engine classification
- Two-stage review loop (extension-validator)
- Teaching annotations
- Install offer

### Clean (Non-Overlapping) Phrases

These triggers are claimed by exactly one skill and have no conflicts:
- "isn't working" / "broken" / "fix my" -> extension-fixer
- "audit" / "validate everything" -> extension-auditor
- "what's new" / "deprecated" -> upgrade-scanner
- "explain my setup" -> setup-explainer
- "recommend" / "what should I add" -> recommendation-engine
- "recipes" / "cookbook" -> scenario-library

### Proposed Phase 4 Resolution

Options to evaluate:
1. **Narrow cc-factory's description** to remove creation triggers, keeping it as a direct-access generator only when explicitly invoked by name or by the concierge.
2. **Add `disable-model-invocation: true`** to cc-factory so it is only reachable when explicitly called by another skill or the user types `/cc-factory`.
3. **Deduplicate descriptions** so only extension-guide (the intended entry point) claims the broad creation triggers.

No changes should be made to routing logic or signal phrases until Phase 4 planning is complete.
