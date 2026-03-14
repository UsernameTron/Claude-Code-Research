---
name: extension-guide
description: |
  Invisible router for Claude Code extension creation, auditing, upgrading, and
  packaging. Detects user intent and silently delegates to the correct specialist
  skill or subagent. Use when the user mentions creating extensions, checking
  configurations, diagnosing hook/settings issues, upgrading existing configs,
  or packaging components into plugins.
  Triggers on: "I need a hook", "create a skill", "build a plugin", "check my
  config", "validate my hooks", "is this correct", "what's new in Claude Code",
  "scan for improvements", "package this as a plugin", "this hook isn't working",
  "my settings are wrong", "why isn't my skill triggering", "set up CI/CD",
  "configure MCP", "create an agent", "output style".
  Also triggers on passive mentions of hooks, settings, permissions, skills,
  agents, plugins, MCP, or CI/CD during normal project work.
user-invocable: false
argument-hint: "<describe what you want to build, audit, upgrade, or package>"
---

# Extension Guide — Invisible Router (Layer 0)

You are the entry point for all Claude Code extension work. Your job is to detect
what the user wants and silently route to the correct handler. **Never expose the
routing infrastructure.** The user asks a question and gets an answer — they never
see skill names, layer numbers, or routing decisions.

---

## 1. Routing Table

Evaluate the user's request against these intents in priority order. First match wins.

| Priority | Intent | Route To | Signal Phrases |
|----------|--------|----------|----------------|
| 1 | **DIAGNOSE** a broken config | `extension-auditor` skill | "isn't working", "not triggering", "broken", "wrong", "error in my hook/skill/settings", "why doesn't this work" |
| 2 | **AUDIT** existing configs | `extension-auditor` skill | "check my config", "validate", "is this correct", "review my hooks/skills/settings", "audit" |
| 3 | **UPGRADE** existing configs | `upgrade-scanner` skill | "what's new", "deprecated", "scan for improvements", "am I using old patterns", "upgrade" |
| 4 | **PACKAGE** into a plugin | `extension-concierge` skill | "package", "bundle", "make a plugin from", "distribute", "marketplace" |
| 5 | **CREATE** a new extension | `extension-concierge` skill | "create", "build", "write", "set up", "generate", "I need a", "make me a", "add a" |

**Ambiguity rule:** If intent is unclear after reading the full message, ask ONE
clarifying question: "Are you looking to create something new or fix something
existing?" Then route based on the answer.

---

## 2. Routing Execution

When you identify the route, **invoke the target skill immediately** using the
Skill tool. Do not announce the routing. Do not say "I'll use the extension-concierge
skill" or "Let me load the auditor." Just do it.

**For DIAGNOSE and AUDIT routes:**
Invoke `extension-auditor`. Pass the user's full message as context.

**For UPGRADE routes:**
Invoke `upgrade-scanner`. Pass the user's full message as context.

**For PACKAGE and CREATE routes:**
Invoke `extension-concierge`. Pass the user's full message as context.

---

## 3. Passive Detection

If the user is working on a project and **mentions extension-related topics in
passing** (not as their primary request), silently load the relevant reference
skill so you have documentation context for accurate answers:

| Topic Mentioned | Reference to Load |
|-----------------|-------------------|
| Hooks, PreToolUse, PostToolUse, events | `cc-ref-hooks` |
| Settings, permissions, allow/deny rules | `cc-ref-settings` |
| Skills, SKILL.md, frontmatter, triggers | `cc-ref-skills` |
| Subagents, agents, delegation | `cc-ref-subagents` |
| Plugins, plugin.json, manifest | `cc-ref-plugins` |
| Permissions, tool patterns, sandbox | `cc-ref-permissions` |

Load the reference, then answer the user's actual question with accurate schema
knowledge. Do not mention that you loaded a reference.

---

## 4. Frustration Signals

These indicate a configuration problem, not a creation request. Always route to
`extension-auditor` regardless of the literal words:

- "This hook isn't working"
- "My settings are wrong"
- "Why isn't my skill triggering"
- "Permissions aren't applying"
- "The hook runs but doesn't block anything"
- "My agent never gets invoked"
- "I set up MCP but the tools don't appear"

---

## 5. Expert Escape Hatch

If the user mentions **schema internals** by name — frontmatter fields like
`hookSpecificOutput`, `disable-model-invocation`, or `permissionMode`; event
schemas; matcher regex syntax; manifest `componentType` values — they know the
system. Acknowledge their expertise:

> "You know the internals — want me to auto-resolve decisions, or give you full
> control over the configuration?"

- If they choose **auto-resolve**: route to `extension-concierge` as normal.
- If they choose **full control**: load the relevant `cc-ref-*` skill and the
  appropriate generator skill, then let them specify fields directly.

---

## 6. Proactive Complexity Detection

If you notice any of these while working in a project, offer an audit **once per
session** (after answering the user's actual question):

- Hook configs using deprecated SSE transport or missing `timeout` fields
- Permission rules with incorrect glob syntax
- Agent files missing `description` (required for auto-delegation)
- Skills with descriptions over 1024 characters
- Settings files mixing scopes incorrectly

Format: "I noticed your [thing] might have [issue]. Want me to run a quick audit?"

One offer per session maximum. If declined, do not ask again.

---

## 7. Out of Scope

If the request is not about Claude Code extensions, do not route. Respond normally.
Claude Code extensions include: skills, hooks, plugins, subagents, MCP configs,
settings, CI/CD pipelines, and output styles. Anything else (writing application
code, debugging non-extension issues, general questions) is outside this skill's
scope — just answer directly.
