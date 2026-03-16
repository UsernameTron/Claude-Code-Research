import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

interface CountResult {
  category: string;
  claimed: number | null;
  actual: number;
  source: string;
  status: "match" | "mismatch" | "no-claim";
}

interface AuditReport {
  counts: CountResult[];
  mismatches: CountResult[];
  summary: { categories: number; mismatches: number; pass: boolean };
}

function countPatternInFiles(dir: string, files: string[], pattern: RegExp): number {
  let total = 0;
  for (const f of files) {
    const path = join(dir, f);
    if (!existsSync(path)) continue;
    const content = readFileSync(path, "utf-8");
    const matches = content.match(pattern);
    total += matches?.length ?? 0;
  }
  return total;
}

function countArchetypes(): number {
  const dir = join(ROOT, "skills", "cc-ref-agent-archetypes");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "SKILL.md");
  // Archetypes are ## headings with kebab-case names (e.g., ## code-reviewer)
  return countPatternInFiles(dir, files, /^## [a-z][a-z0-9-]*$/gm);
}

function countDevRecipes(): number {
  const dir = join(ROOT, "skills", "dev-recipes", "recipes");
  if (!existsSync(dir)) return 0;
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  // Dev recipes use ## XX00: pattern (e.g., ## CT01: Code Reviewer)
  return countPatternInFiles(dir, files, /^## [A-Z]{2}\d{2}:/gm);
}

function countTeamPatterns(): number {
  const path = join(ROOT, "skills", "team-combo-engine", "team-registry.md");
  if (!existsSync(path)) return 0;
  const content = readFileSync(path, "utf-8");
  const matches = content.match(/^## TQ\d{2}:/gm);
  return matches?.length ?? 0;
}

function countExtensionRecipes(): number {
  const dir = join(ROOT, "skills", "scenario-library", "recipes");
  if (!existsSync(dir)) return 0;
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  // Extension recipes use ### X00: pattern (e.g., ### A01: auto-lint) or ## X00:
  let total = 0;
  for (const f of files) {
    const content = readFileSync(join(dir, f), "utf-8");
    // Count ### with ID pattern
    const h3 = content.match(/^### [A-Z]\d{2}:/gm);
    // Count ## with ID pattern (teams.md uses ## T01:)
    const h2 = content.match(/^## [A-Z]\d{2}:/gm);
    total += (h3?.length ?? 0) + (h2?.length ?? 0);
  }
  return total;
}

function countComboPatterns(): number {
  const path = join(ROOT, "skills", "extension-combo-engine", "combo-registry.md");
  if (!existsSync(path)) return 0;
  const content = readFileSync(path, "utf-8");
  const matches = content.match(/^## CQ\d{2}:/gm);
  return matches?.length ?? 0;
}

function extractClaimedNumbers(): Record<string, number> {
  const claims: Record<string, number> = {};

  // README.md
  const readmePath = join(ROOT, "README.md");
  if (existsSync(readmePath)) {
    const readme = readFileSync(readmePath, "utf-8");

    const archetypeMatch = readme.match(/(\d+)\s+agent\s+archetypes/i);
    if (archetypeMatch) claims["archetypes-readme"] = parseInt(archetypeMatch[1]!);

    const recipeMatch = readme.match(/(\d+)\s+pre-built\s+recipes\s+for\s+instant\s+agent/i);
    if (recipeMatch) claims["dev-recipes-readme"] = parseInt(recipeMatch[1]!);

    const teamMatch = readme.match(/(\d+)\s+team\s+combo\s+patterns/i);
    if (teamMatch) claims["team-patterns-readme"] = parseInt(teamMatch[1]!);

    const extRecipeMatch = readme.match(/(\d+)\s+pre-built\s+extension\s+recipes/i);
    if (extRecipeMatch) claims["ext-recipes-readme"] = parseInt(extRecipeMatch[1]!);

    const comboMatch = readme.match(/(\d+)\s+coordinated\s+multi-extension\s+combo/i);
    if (comboMatch) claims["combo-patterns-readme"] = parseInt(comboMatch[1]!);
  }

  // plugin.json
  const pluginPath = join(ROOT, ".claude-plugin", "plugin.json");
  if (existsSync(pluginPath)) {
    try {
      const plugin = JSON.parse(readFileSync(pluginPath, "utf-8"));
      const desc = plugin.description || "";

      const archetypeMatch = desc.match(/(\d+)\s+.*?agent\s+archetypes/i);
      if (archetypeMatch) claims["archetypes-plugin"] = parseInt(archetypeMatch[1]!);

      const recipeMatch = desc.match(/(\d+)\s+recipes\b/i);
      if (recipeMatch) claims["dev-recipes-plugin"] = parseInt(recipeMatch[1]!);

      const teamMatch = desc.match(/(\d+)\s+team\s+patterns/i);
      if (teamMatch) claims["team-patterns-plugin"] = parseInt(teamMatch[1]!);

      const extRecipeMatch = desc.match(/(\d+)\s+recipes/i);
      if (extRecipeMatch) claims["ext-recipes-plugin"] = parseInt(extRecipeMatch[1]!);

      const comboMatch = desc.match(/(\d+)\s+combo\s+patterns/i);
      if (comboMatch) claims["combo-patterns-plugin"] = parseInt(comboMatch[1]!);
    } catch {}
  }

  return claims;
}

// --- Main ---

const archetypes = countArchetypes();
const devRecipes = countDevRecipes();
const teamPatterns = countTeamPatterns();
const extRecipes = countExtensionRecipes();
const comboPatterns = countComboPatterns();

const claims = extractClaimedNumbers();

const TOLERANCE = 0.10; // 10%

function checkClaim(
  category: string,
  actual: number,
  claimKey: string,
  source: string
): CountResult {
  const claimed = claims[claimKey] ?? null;
  if (claimed === null) {
    return { category, claimed: null, actual, source, status: "no-claim" };
  }
  // Mismatch if claimed significantly exceeds actual (beyond tolerance)
  const exceeds = claimed > actual * (1 + TOLERANCE);
  // Also flag if actual significantly exceeds claimed
  const undercount = actual > claimed * (1 + TOLERANCE);
  return {
    category,
    claimed,
    actual,
    source,
    status: exceeds || undercount ? "mismatch" : "match",
  };
}

const counts: CountResult[] = [
  checkClaim("Agent Archetypes", archetypes, "archetypes-readme", "README.md"),
  checkClaim("Agent Archetypes", archetypes, "archetypes-plugin", "plugin.json"),
  checkClaim("Dev Recipes", devRecipes, "dev-recipes-readme", "README.md"),
  checkClaim("Dev Recipes", devRecipes, "dev-recipes-plugin", "plugin.json"),
  checkClaim("Team Patterns", teamPatterns, "team-patterns-readme", "README.md"),
  checkClaim("Team Patterns", teamPatterns, "team-patterns-plugin", "plugin.json"),
  checkClaim("Extension Recipes", extRecipes, "ext-recipes-readme", "README.md"),
  checkClaim("Extension Recipes", extRecipes, "ext-recipes-plugin", "plugin.json"),
  checkClaim("Combo Patterns", comboPatterns, "combo-patterns-readme", "README.md"),
  checkClaim("Combo Patterns", comboPatterns, "combo-patterns-plugin", "plugin.json"),
];

const mismatches = counts.filter((c) => c.status === "mismatch");

// Also flag if claimed exceeds actual (the critical direction)
const inflated = counts.filter(
  (c) => c.status === "mismatch" && c.claimed !== null && c.claimed > c.actual
);

const report: AuditReport = {
  counts,
  mismatches,
  summary: {
    categories: counts.length,
    mismatches: mismatches.length,
    pass: inflated.length === 0,
  },
};

console.log(JSON.stringify(report, null, 2));

// Print human-readable summary
console.error("\n=== Content Audit Summary ===");
console.error(`Archetypes: ${archetypes} actual`);
console.error(`Dev Recipes: ${devRecipes} actual`);
console.error(`Team Patterns: ${teamPatterns} actual`);
console.error(`Extension Recipes: ${extRecipes} actual`);
console.error(`Combo Patterns: ${comboPatterns} actual`);
if (mismatches.length > 0) {
  console.error("\nMismatches:");
  for (const m of mismatches) {
    console.error(`  ${m.category} (${m.source}): claimed=${m.claimed}, actual=${m.actual}`);
  }
}
if (inflated.length > 0) {
  console.error(`\nFAIL: ${inflated.length} inflated claim(s) found`);
} else {
  console.error("\nPASS: No inflated claims");
}

process.exit(inflated.length > 0 ? 1 : 0);
