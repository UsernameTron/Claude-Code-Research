import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

const ROOT = resolve(import.meta.dirname, "..");

interface RoutingIssue {
  source: string;
  target: string;
  message: string;
}

interface RoutingReport {
  routes: { source: string; targets: string[] }[];
  brokenReferences: RoutingIssue[];
  unreachableSkills: string[];
  entryPoints: string[];
  reachableCount: number;
  totalSkills: number;
  summary: { brokenRefs: number; unreachable: number; pass: boolean };
}

function extractFrontmatter(content: string): Record<string, unknown> | null {
  const lines = content.split("\n");
  if (lines[0]?.trim() !== "---") return null;
  const endIdx = lines.indexOf("---", 1);
  if (endIdx === -1) return null;
  try {
    return parseYaml(lines.slice(1, endIdx).join("\n")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getAllSkillNames(): Set<string> {
  const skillsDir = join(ROOT, "skills");
  if (!existsSync(skillsDir)) return new Set();
  return new Set(
    readdirSync(skillsDir).filter((d) =>
      existsSync(join(skillsDir, d, "SKILL.md"))
    )
  );
}

function getAllAgentNames(): Set<string> {
  const agentsDir = join(ROOT, "agents");
  if (!existsSync(agentsDir)) return new Set();
  return new Set(
    readdirSync(agentsDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""))
  );
}

function extractRoutingTargets(filePath: string): string[] {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, "utf-8");
  const targets = new Set<string>();

  // Extract from routing table: `skill-name` in markdown tables and backtick refs
  // Pattern: `some-skill-name` where the name matches skill naming conventions
  const backtickRefs = content.matchAll(/`([a-z][a-z0-9-]+(?:-[a-z0-9]+)+)`/g);
  for (const match of backtickRefs) {
    targets.add(match[1]!);
  }

  // Extract from frontmatter skills: field
  const fm = extractFrontmatter(content);
  if (fm && Array.isArray(fm["skills"])) {
    for (const s of fm["skills"]) {
      if (typeof s === "string") targets.add(s);
    }
  }

  return [...targets];
}

/** Collect archetype names from cc-ref-agent-archetypes — these are template
 *  names for agents that get generated at runtime, not existing files. */
function getArchetypeNames(): Set<string> {
  const names = new Set<string>();
  const dir = join(ROOT, "skills", "cc-ref-agent-archetypes");
  if (!existsSync(dir)) return names;
  for (const f of readdirSync(dir)) {
    if (f === "SKILL.md" || !f.endsWith(".md")) continue;
    const content = readFileSync(join(dir, f), "utf-8");
    const matches = content.matchAll(/^## ([a-z][a-z0-9-]*)$/gm);
    for (const m of matches) names.add(m[1]!);
  }
  return names;
}

// --- Main ---

const allSkills = getAllSkillNames();
const allAgents = getAllAgentNames();
const allTargets = new Set([...allSkills, ...allAgents]);
const archetypeNames = getArchetypeNames();

// Key routing files
const routerFiles: { name: string; path: string }[] = [
  { name: "extension-guide", path: join(ROOT, "skills", "extension-guide", "SKILL.md") },
  { name: "smart-scaffold", path: join(ROOT, "skills", "smart-scaffold", "SKILL.md") },
  { name: "extension-concierge", path: join(ROOT, "skills", "extension-concierge", "SKILL.md") },
  { name: "intent-engine", path: join(ROOT, "skills", "intent-engine", "SKILL.md") },
  { name: "agent-factory", path: join(ROOT, "skills", "agent-factory", "SKILL.md") },
  { name: "cc-factory", path: join(ROOT, "skills", "cc-factory", "SKILL.md") },
  { name: "dev-recipes", path: join(ROOT, "skills", "dev-recipes", "SKILL.md") },
  { name: "team-configurator", path: join(ROOT, "skills", "team-configurator", "SKILL.md") },
  { name: "team-combo-engine", path: join(ROOT, "skills", "team-combo-engine", "SKILL.md") },
  { name: "scenario-library", path: join(ROOT, "skills", "scenario-library", "SKILL.md") },
  { name: "extension-combo-engine", path: join(ROOT, "skills", "extension-combo-engine", "SKILL.md") },
  { name: "dev-team-guide", path: join(ROOT, "skills", "dev-team-guide", "SKILL.md") },
  { name: "dev-team-concierge", path: join(ROOT, "skills", "dev-team-concierge", "SKILL.md") },
];

// Build adjacency list from all skills (not just routers)
const adjacency = new Map<string, Set<string>>();

for (const skillName of allSkills) {
  const skillPath = join(ROOT, "skills", skillName, "SKILL.md");
  const targets = extractRoutingTargets(skillPath);
  const validTargets = new Set<string>();
  for (const t of targets) {
    if (allSkills.has(t) || allAgents.has(t)) {
      validTargets.add(t);
    }
  }
  adjacency.set(skillName, validTargets);
}

// Also scan agents for references to skills
for (const agentName of allAgents) {
  const agentPath = join(ROOT, "agents", `${agentName}.md`);
  const targets = extractRoutingTargets(agentPath);
  const validTargets = new Set<string>();
  for (const t of targets) {
    if (allSkills.has(t) || allAgents.has(t)) {
      validTargets.add(t);
    }
  }
  adjacency.set(agentName, validTargets);
}

// Build routes report
const routes: { source: string; targets: string[] }[] = [];
const brokenReferences: RoutingIssue[] = [];

for (const router of routerFiles) {
  if (!existsSync(router.path)) continue;
  const targets = extractRoutingTargets(router.path);
  const validTargets: string[] = [];
  for (const t of targets) {
    if (t === router.name) continue; // skip self-references
    if (allSkills.has(t) || allAgents.has(t)) {
      validTargets.push(t);
    } else {
      // Only flag if this looks like an intended dispatch target (skill/agent name).
      // Skip: archetype names, library/framework names, config field names, general terms.
      if (archetypeNames.has(t)) continue; // archetype template name, not a file

      // Known planned-but-not-yet-created reference skills (documented as such in source)
      const knownPlannedRefs = new Set([
        "cc-ref-mcp",
        "cc-ref-cicd",
        "cc-ref-output-styles",
      ]);
      if (knownPlannedRefs.has(t)) continue;

      const skipPatterns = [
        /^npm-/,
        /^git-/,
        /^pre-/,
        /^post-/,
        /^auto-/,
        /^user-invocable$/,
        /^allowed-tools$/,
        /^disable-model/,
        /^argument-hint$/,
        /^plugin-dir$/,
        /^claude-code$/,
        /^settings-json$/,
        /^node-modules$/,
        /^package-json$/,
        /^plain-/,           // descriptive terms
        /^high-confidence$/,
        /^low-confidence$/,
        /^fire-and-forget$/,
        /-resolution$/,      // e.g., intent-resolution
        /-specialist$/,      // generated agent names
        /-developer$/,       // generated agent names
        /-engineer$/,        // generated agent names
        /-architect$/,       // generated agent names
        /-expert$/,          // generated agent names
        /-orchestrator$/,    // generated agent names
        /-components$/,      // UI terms
        /-state$/,           // state management terms
        /-backend$/,         // backend variants
        /-api$/,             // API terms
        /-orm$/,             // ORM terms
        /-activerecord$/,
        /-eloquent$/,
        /-pipeline$/,
        /^react-/,           // framework names
        /^vue-/,
        /^nuxt-/,
        /^nextjs-/,
        /^django-/,
        /^rails-/,
        /^laravel-/,
        /^scikit-/,
        /^pytorch-/,
      ];
      if (!skipPatterns.some((p) => p.test(t))) {
        brokenReferences.push({
          source: router.name,
          target: t,
          message: `Router "${router.name}" references "${t}" which is not a known skill or agent`,
        });
      }
    }
  }
  if (validTargets.length > 0) {
    routes.push({ source: router.name, targets: [...new Set(validTargets)] });
  }
}

// Find entry points: user-invocable skills + known routers
const entryPoints = new Set<string>();

// Skills with user-invocable: true or not set (default is invocable)
for (const skillName of allSkills) {
  const content = readFileSync(join(ROOT, "skills", skillName, "SKILL.md"), "utf-8");
  const fm = extractFrontmatter(content);
  if (!fm) continue;
  const invocable = fm["user-invocable"];
  if (invocable === undefined || invocable === true) {
    entryPoints.add(skillName);
  }
}

// Agents are always entry points (can be invoked)
for (const agentName of allAgents) {
  entryPoints.add(agentName);
}

// BFS from entry points
const reachable = new Set<string>();
const queue = [...entryPoints];
while (queue.length > 0) {
  const current = queue.pop()!;
  if (reachable.has(current)) continue;
  reachable.add(current);
  const neighbors = adjacency.get(current);
  if (neighbors) {
    for (const n of neighbors) {
      if (!reachable.has(n)) queue.push(n);
    }
  }
}

// Find unreachable skills
const unreachable: string[] = [];
for (const s of allSkills) {
  if (!reachable.has(s)) {
    unreachable.push(s);
  }
}

const report: RoutingReport = {
  routes,
  brokenReferences,
  unreachableSkills: unreachable,
  entryPoints: [...entryPoints].sort(),
  reachableCount: reachable.size,
  totalSkills: allSkills.size + allAgents.size,
  summary: {
    brokenRefs: brokenReferences.length,
    unreachable: unreachable.length,
    pass: brokenReferences.length === 0,
  },
};

console.log(JSON.stringify(report, null, 2));

// Human-readable summary
console.error("\n=== Routing Validation Summary ===");
console.error(`Total skills: ${allSkills.size}, Total agents: ${allAgents.size}`);
console.error(`Entry points: ${entryPoints.size}`);
console.error(`Reachable: ${reachable.size}/${allSkills.size + allAgents.size}`);
console.error(`Routes found: ${routes.length}`);

if (brokenReferences.length > 0) {
  console.error(`\nBroken references (${brokenReferences.length}):`);
  for (const br of brokenReferences) {
    console.error(`  ${br.source} -> ${br.target}`);
  }
}

if (unreachable.length > 0) {
  console.error(`\nUnreachable skills (${unreachable.length}, warning only):`);
  for (const u of unreachable) {
    console.error(`  ${u}`);
  }
}

console.error(
  brokenReferences.length > 0
    ? `\nFAIL: ${brokenReferences.length} broken reference(s)`
    : "\nPASS: No broken references"
);

process.exit(brokenReferences.length > 0 ? 1 : 0);
