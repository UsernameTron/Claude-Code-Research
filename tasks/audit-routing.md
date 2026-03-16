# Routing Architecture Audit

Generated: 2026-03-16

---

## 1. Dependency Graph

```
LAYER 0 — ROUTERS (Entry Points)
═════════════════════════════════

extension-guide (invisible router, not user-invocable)
├── FIX        → extension-fixer (skill)
├── AUDIT      → extension-auditor (skill)
├── UPGRADE    → upgrade-scanner (skill)
├── EXPLAIN    → setup-explainer (skill)
├── RECOMMEND  → recommendation-engine (agent)
├── PACKAGE    → extension-concierge (skill)
├── CREATE     → smart-scaffold (skill, for tier classification)
│                  └── returns tier → extension-concierge
└── PASSIVE    → cc-ref-hooks, cc-ref-settings, cc-ref-skills,
                   cc-ref-subagents, cc-ref-plugins, cc-ref-permissions


LAYER 1 — ORCHESTRATORS
════════════════════════

extension-concierge (orchestrator, user-invocable)
│  skills: [intent-engine]
│
├── SIMPLE PATH (Tier 1) — Direct to generator:
│   ├── hook         → hook-factory (skill)
│   ├── skill        → skill-factory (skill)
│   ├── settings     → settings-architect (skill)
│   ├── plugin       → plugin-packager (skill)
│   ├── mcp          → mcp-configurator (skill)
│   ├── cicd         → cicd-generator (skill)
│   ├── output-style → output-style-creator (skill)
│   ├── subagent     → cc-factory (skill, simple case)
│   └── subagent     → subagent-generator (agent, complex case)
│
├── COMPLEX PATH (Tier 2) — Combo engine:
│   └── extension-combo-engine (skill)
│       └── dispatches to generator skills + extension-validator (agent)
│
├── COMPLEX PATH (Tier 3) — System architect:
│   └── system-architect (agent)
│       └── dispatches to generators, then extension-validator (agent)
│
├── Plugin creation  → plugin-builder (agent) + extension-validator (agent)
├── Hook system (3+) → hook-engineer (agent) + extension-validator (agent)
├── Complex subagent → subagent-generator (agent) + extension-validator (agent)
│
├── POST-GENERATION:
│   ├── review loop  → extension-validator (agent)
│   ├── teaching     → teaching-vocabulary.md (local file, not a skill)
│   └── install      → extension-installer (skill)
│
└── REFERENCE LOADING:
    ├── hook     → cc-ref-hooks
    ├── plugin   → cc-ref-plugins
    ├── settings → cc-ref-settings, cc-ref-permissions
    ├── skill    → cc-ref-skills
    └── subagent → cc-ref-subagents

smart-scaffold (tier classifier, not user-invocable)
│  allowed-tools: [Read, Agent]
│  Local files: tier-classifier.md, question-flows/*.md
│
└── Returns tier + route:
    ├── Tier 1 → extension-concierge (simple)
    ├── Tier 2 → extension-concierge → extension-combo-engine
    └── Tier 3 → extension-concierge → system-architect

intent-engine (classifier, not user-invocable)
│  skills: [cc-ref-hooks, cc-ref-skills, cc-ref-settings,
│           cc-ref-subagents, cc-ref-plugins, cc-ref-permissions]
│
└── Returns classification → extension-concierge


DEV TEAM FACTORY (separate pipeline)
═════════════════════════════════════

(dev-team-guide — FUTURE, does not exist)
│
└── (dev-team-concierge — FUTURE, does not exist)
        │
        ├── agent-factory (skill, not user-invocable)
        │   └── receives from dev-team-concierge (references it in SKILL.md)
        │
        ├── team-configurator (skill, user-invocable)
        │   └── stack detection + team assembly
        │
        ├── dev-recipes (skill, user-invocable)
        │   └── 86 recipes in local recipe files
        │
        └── team-combo-engine (skill, not user-invocable)
            └── references: team-configurator, stack-analyzer, cc-ref-agent-archetypes

Dev Team Agents:
├── team-architect (agent)
├── agent-quality-reviewer (agent)
└── stack-analyzer (agent)

Dev Team Reference Skills:
├── cc-ref-agent-archetypes
└── cc-ref-agent-workflows


LIFECYCLE TOOLS (user-invocable, not routed through extension-guide)
════════════════════════════════════════════════════════════════════

├── scenario-library (/recipes)
├── extension-installer (/install)
├── setup-explainer (/explain-my-setup)
├── extension-fixer (/fix-my-extension)
├── extension-auditor (/audit)
├── upgrade-scanner (/upgrade)
└── sync-docs (doc-sync skill, /sync-docs)


REFERENCE SKILLS (loaded on demand, never user-invocable)
═════════════════════════════════════════════════════════

├── cc-ref-hooks
├── cc-ref-settings
├── cc-ref-skills
├── cc-ref-permissions
├── cc-ref-plugins
├── cc-ref-subagents
├── cc-ref-multi-agent
├── cc-ref-agent-archetypes
└── cc-ref-agent-workflows
```

---

## 2. Full Skill & Agent Inventory

### Skills (37 total, in skills/)

| Skill Name | User-Invocable | Reached By |
|---|---|---|
| extension-guide | No (router) | Direct trigger detection |
| intent-engine | No | extension-concierge (skills: field) |
| smart-scaffold | No | extension-guide (CREATE route) |
| extension-concierge | Yes | extension-guide, direct |
| extension-combo-engine | No | extension-concierge (Tier 2) |
| cc-factory | Yes-ish | extension-concierge (simple subagent), direct |
| hook-factory | Yes | extension-concierge |
| skill-factory | Yes | extension-concierge |
| settings-architect | Yes | extension-concierge |
| plugin-packager | Yes | extension-concierge |
| mcp-configurator | Yes | extension-concierge |
| cicd-generator | Yes | extension-concierge |
| output-style-creator | Yes | extension-concierge |
| scenario-library | Yes | direct (/recipes) |
| extension-installer | Yes | extension-concierge post-gen, direct (/install) |
| setup-explainer | Yes | extension-guide (EXPLAIN), direct |
| extension-fixer | Yes | extension-guide (FIX), direct |
| extension-auditor | Yes | extension-guide (AUDIT), direct |
| upgrade-scanner | Yes | extension-guide (UPGRADE), direct |
| doc-sync (name: sync-docs) | Yes | direct (/sync-docs) |
| agent-factory | No | dev-team-concierge (FUTURE) |
| team-configurator | Yes | direct (/team-configurator) |
| dev-recipes | Yes | direct (/dev-recipes) |
| team-combo-engine | No | team-configurator, team-architect |
| cc-ref-hooks | No (ref) | intent-engine, extension-fixer, extension-guide |
| cc-ref-settings | No (ref) | intent-engine, extension-fixer, extension-guide |
| cc-ref-skills | No (ref) | intent-engine, extension-guide |
| cc-ref-permissions | No (ref) | intent-engine, extension-fixer, extension-guide |
| cc-ref-plugins | No (ref) | intent-engine, extension-guide, system-architect |
| cc-ref-subagents | No (ref) | intent-engine, extension-fixer, subagent-generator, extension-guide |
| cc-ref-multi-agent | No (ref) | Not referenced by any router or orchestrator |
| cc-ref-agent-archetypes | No (ref) | team-combo-engine, agent-factory |
| cc-ref-agent-workflows | No (ref) | agent-factory |

### Agents (10 total, in agents/)

| Agent Name | Reached By |
|---|---|
| hook-engineer | extension-concierge (complex hook systems) |
| plugin-builder | extension-concierge (plugin creation) |
| extension-validator | extension-concierge (review loop), combo-engine, system-architect |
| doc-sync-checker | Not referenced by any router or skill |
| subagent-generator | extension-concierge (complex subagent path) |
| recommendation-engine | extension-guide (RECOMMEND route) |
| system-architect | extension-concierge (Tier 3) |
| team-architect | Referenced in README; reached from team-combo-engine context |
| agent-quality-reviewer | Referenced in README; no explicit routing path |
| stack-analyzer | Referenced by team-combo-engine |

---

## 3. Dead Skills (Not Reachable from Any Router or User-Invocable Entry Point)

### Confirmed Dead

| Component | Type | Issue |
|---|---|---|
| **cc-ref-multi-agent** | Reference skill | Not referenced in any `skills:` field, routing table, or reference-loading section. No router, orchestrator, or generator loads it. |
| **doc-sync-checker** | Agent | Not referenced by any skill or routing path. The `doc-sync` (sync-docs) skill exists and is user-invocable, but it does NOT reference this agent. These appear to be duplicate/parallel implementations. |
| **agent-quality-reviewer** | Agent | Listed in README under Dev Team specialist agents but no skill or agent dispatches to it. agent-factory does not reference it. |

### Partially Dead (Dev Team Factory — No Router Yet)

| Component | Type | Issue |
|---|---|---|
| **agent-factory** | Skill | Receives input from `dev-team-concierge` per its SKILL.md, but dev-team-concierge does not exist. Currently only reachable if someone manually invokes it or a recipe dispatches to it. |
| **team-combo-engine** | Skill | Not user-invocable. Reachable from team-configurator and team-architect contexts, but no formal routing path from a Layer 0 router exists. |

---

## 4. Broken References (Targets That Don't Exist)

| Source | References | Status |
|---|---|---|
| extension-concierge SKILL.md | `teaching-vocabulary.md` | EXISTS as local file in `skills/extension-concierge/teaching-vocabulary.md`. Not broken. |
| agent-factory SKILL.md | `dev-team-concierge` | DOES NOT EXIST. agent-factory says "Receives from dev-team-concierge" but this orchestrator was never built. |
| README.md Architecture | `dev-team-guide` | DOES NOT EXIST. Marked as "(future)" in README. |
| README.md Architecture | `dev-team-concierge` | DOES NOT EXIST. Marked as "(future)" in README. |

No skill or agent references a target skill/agent name that is completely absent from the filesystem, aside from the two future Dev Team routing layers listed above. All Extension Factory cross-references resolve correctly.

---

## 5. README Discrepancies

### Items Marked "(future)" in README

| Component | README Status | Actual Status |
|---|---|---|
| dev-team-guide | "(future)" | Does not exist. Correct label. |
| dev-team-concierge | "(future)" | Does not exist. Correct label. |

### README vs Actual Inventory Mismatches

| Issue | Details |
|---|---|
| **doc-sync skill name mismatch** | README lists the skill as `doc-sync` but the SKILL.md frontmatter says `name: sync-docs`. The directory is `skills/doc-sync/`. This creates potential confusion -- the skill name used at invocation time is `sync-docs` (from frontmatter), not `doc-sync` (the directory name). |
| **doc-sync-checker agent not in README** | The agent `agents/doc-sync-checker.md` exists on disk but is NOT listed in the README Components section. It appears under the Specialist Agents table (as "doc-sync-checker: Detects documentation drift") but has no routing path. |
| **cc-ref-multi-agent not referenced** | Listed in README under Reference Skills but no skill, agent, or routing path loads it. It is orphaned documentation. |
| **README skill count** | CLAUDE.md says "18 skills" but the actual count is 33 skills (in skills/) plus 4 in downloads/. README does not state a count, but the CLAUDE.md project-specific rules are stale. |
| **Subagent count** | CLAUDE.md says "3 specialist subagents" but there are 10 agents in agents/. CLAUDE.md project-specific rules are stale. |
| **cc-factory role** | README describes cc-factory as "Direct-access generator with full detection/resolution/output logic" under Orchestration (Layer 1). extension-concierge routes simple subagent requests to it. Its actual role straddles Layer 1 (orchestration) and Layer 2 (generation). |

---

## 6. Signal Phrase Conflicts

### Critical Overlaps

| Phrase / Pattern | Claimed By | Conflict |
|---|---|---|
| **"create a skill" / "build a plugin" / "I need a hook"** | extension-guide (description), extension-concierge (description), cc-factory (description) | Three skills all list these as triggers. extension-guide is not user-invocable so relies on description matching. extension-concierge IS user-invocable. cc-factory IS user-invocable. If Claude sees "create a skill", all three descriptions match. |
| **"package" / "bundle" / "distribute" / "marketplace"** | extension-guide (PACKAGE route), extension-concierge (description), plugin-packager (implicit) | Both extension-guide and extension-concierge claim package/plugin triggers. |
| **"CI/CD" / "set up CI/CD"** | extension-guide (description), extension-concierge (description), cc-factory (detection rules) | Three-way overlap on CI/CD triggers. |
| **"configure MCP" / "MCP"** | extension-guide (description), extension-concierge (description), cc-factory (detection rules) | Three-way overlap. |
| **"output style"** | extension-guide (description), extension-concierge (description), cc-factory (detection rules) | Three-way overlap. |
| **"create an agent" / "subagent"** | extension-guide (description), extension-concierge (description), subagent-generator (agent description) | Three-way overlap. |

### Analysis

The three-way overlap between extension-guide, extension-concierge, and cc-factory is by design (they form a routing chain: guide -> concierge -> factory). However, since both extension-concierge and cc-factory are user-invocable with overlapping descriptions, Claude's skill selection may route directly to cc-factory instead of going through the concierge's review loop and teaching annotations. This bypasses:
- Tier classification (smart-scaffold)
- Intent engine classification
- Two-stage review loop (extension-validator)
- Teaching annotations
- Install offer

### Non-Overlapping (Clean)

| Phrase Pattern | Exclusive Owner |
|---|---|
| "isn't working" / "broken" / "fix my" | extension-fixer |
| "audit" / "validate everything" / "health check" | extension-auditor |
| "what's new" / "deprecated" / "scan for improvements" | upgrade-scanner |
| "explain my setup" / "what do I have" / "what's installed" | setup-explainer |
| "what should I add" / "what am I missing" / "recommend" | recommendation-engine |
| "recipes" / "cookbook" / "show me examples" | scenario-library |
| "/dev-recipes" / dev recipe IDs | dev-recipes |
| "/team-configurator" / "--detect-only" | team-configurator |

---

## 7. Summary of Issues

### High Priority
1. **cc-ref-multi-agent is orphaned** — listed in README, exists on disk, but nothing loads it.
2. **doc-sync-checker agent is orphaned** — exists on disk, listed in README, but no routing path dispatches to it.
3. **agent-quality-reviewer agent has no routing path** — listed in README but no skill dispatches to it.
4. **cc-factory bypasses the review pipeline** — overlapping signal phrases with extension-concierge allow direct invocation, skipping validation, tier classification, and teaching.

### Medium Priority
5. **doc-sync / sync-docs name mismatch** — directory is `doc-sync`, frontmatter name is `sync-docs`.
6. **CLAUDE.md skill/agent counts are stale** — says 18 skills and 3 agents; actual is 33+ and 10.
7. **Dev Team Factory has no router** — agent-factory references non-existent `dev-team-concierge`. The "(future)" label in README is accurate but the agent-factory SKILL.md treats it as if it exists.

### Low Priority
8. **dev-team-guide and dev-team-concierge** — marked future in README, not yet built. Accurate labeling.
