import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { parse as parseYaml } from "yaml";

const ROOT = resolve(import.meta.dirname, "..");

interface Issue {
  file: string;
  field: string;
  message: string;
}

interface Report {
  errors: Issue[];
  warnings: Issue[];
  summary: { total: number; passed: number; failed: number };
}

const KEBAB_RE = /^[a-z][a-z0-9-]*$/;

function extractFrontmatter(content: string): { yaml: string; body: string } | null {
  const lines = content.split("\n");
  if (lines[0]?.trim() !== "---") return null;
  const endIdx = lines.indexOf("---", 1);
  if (endIdx === -1) return null;
  return {
    yaml: lines.slice(1, endIdx).join("\n"),
    body: lines.slice(endIdx + 1).join("\n"),
  };
}

function relPath(abs: string): string {
  return abs.replace(ROOT + "/", "");
}

function findSkills(): string[] {
  const skillsDir = join(ROOT, "skills");
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir)
    .filter((d) => {
      const p = join(skillsDir, d, "SKILL.md");
      return existsSync(p);
    })
    .map((d) => join(skillsDir, d, "SKILL.md"));
}

function findAgents(): string[] {
  const agentsDir = join(ROOT, "agents");
  if (!existsSync(agentsDir)) return [];
  return readdirSync(agentsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => join(agentsDir, f));
}

function validateFile(
  filePath: string,
  kind: "skill" | "agent",
  errors: Issue[],
  warnings: Issue[]
): boolean {
  const rel = relPath(filePath);
  const content = readFileSync(filePath, "utf-8");
  const fm = extractFrontmatter(content);

  if (!fm) {
    errors.push({ file: rel, field: "frontmatter", message: "No valid YAML frontmatter found" });
    return false;
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = parseYaml(fm.yaml) as Record<string, unknown>;
  } catch (e) {
    errors.push({ file: rel, field: "frontmatter", message: `YAML parse error: ${e}` });
    return false;
  }

  if (!parsed || typeof parsed !== "object") {
    errors.push({ file: rel, field: "frontmatter", message: "Frontmatter is not an object" });
    return false;
  }

  let valid = true;

  // name
  const name = parsed["name"];
  if (!name || typeof name !== "string") {
    errors.push({ file: rel, field: "name", message: "Missing or non-string name" });
    valid = false;
  } else {
    if (!KEBAB_RE.test(name)) {
      errors.push({ file: rel, field: "name", message: `Name "${name}" is not kebab-case (pattern: ${KEBAB_RE})` });
      valid = false;
    }
    if (name.length > 64) {
      errors.push({ file: rel, field: "name", message: `Name exceeds 64 chars (${name.length})` });
      valid = false;
    }

    // For skills, name must match directory
    if (kind === "skill") {
      const dirName = basename(dirname(filePath));
      if (name !== dirName) {
        errors.push({
          file: rel,
          field: "name",
          message: `Name "${name}" does not match directory "${dirName}"`,
        });
        valid = false;
      }
    }

    // For agents, name must match filename (without .md)
    if (kind === "agent") {
      const fileName = basename(filePath, ".md");
      if (name !== fileName) {
        warnings.push({
          file: rel,
          field: "name",
          message: `Name "${name}" does not match filename "${fileName}"`,
        });
      }
    }
  }

  // description
  const desc = parsed["description"];
  if (!desc || (typeof desc !== "string")) {
    errors.push({ file: rel, field: "description", message: "Missing or non-string description" });
    valid = false;
  } else {
    if (desc.trim().length === 0) {
      errors.push({ file: rel, field: "description", message: "Description is empty" });
      valid = false;
    }
    if (desc.length > 1024) {
      errors.push({ file: rel, field: "description", message: `Description exceeds 1024 chars (${desc.length})` });
      valid = false;
    }
  }

  // Optional: user-invocable
  if ("user-invocable" in parsed) {
    if (typeof parsed["user-invocable"] !== "boolean") {
      errors.push({ file: rel, field: "user-invocable", message: "Must be boolean" });
      valid = false;
    }
  }

  // Optional: model
  if ("model" in parsed) {
    const model = parsed["model"];
    const validModels = ["sonnet", "opus", "haiku", "inherit"];
    if (typeof model !== "string" || !validModels.includes(model)) {
      errors.push({
        file: rel,
        field: "model",
        message: `Invalid model "${model}" — must be one of: ${validModels.join(", ")}`,
      });
      valid = false;
    }
  }

  // Optional: allowed-tools
  if ("allowed-tools" in parsed) {
    if (typeof parsed["allowed-tools"] !== "string") {
      errors.push({ file: rel, field: "allowed-tools", message: "Must be a string" });
      valid = false;
    }
  }

  return valid;
}

function crossReferenceCheck(filePath: string, skillNames: Set<string>, warnings: Issue[]): void {
  const rel = relPath(filePath);
  const content = readFileSync(filePath, "utf-8");
  const fm = extractFrontmatter(content);
  if (!fm) return;

  // Look for backtick-quoted strings that could be skill references
  const backtickRefs = fm.body.matchAll(/`([a-z][a-z0-9-]+)`/g);
  for (const match of backtickRefs) {
    const ref = match[1]!;
    // Only flag if it looks like a skill name (contains hyphen, reasonable length)
    // and could plausibly be referencing a skill
    if (ref.includes("-") && ref.length >= 5 && ref.length <= 64) {
      // Check if it's a known skill name
      if (skillNames.has(ref)) continue; // valid reference
      // Check if it looks like it SHOULD be a skill (ends with common suffixes or matches pattern)
      const skillishSuffixes = ["-factory", "-engine", "-guide", "-fixer", "-auditor", "-scanner", "-explainer", "-configurator", "-concierge", "-installer", "-packager", "-library", "-scaffold", "-creator"];
      if (skillishSuffixes.some((s) => ref.endsWith(s)) || ref.startsWith("cc-ref-") || ref.startsWith("extension-")) {
        if (!skillNames.has(ref)) {
          warnings.push({
            file: rel,
            field: "cross-reference",
            message: `References \`${ref}\` which does not exist as a skill`,
          });
        }
      }
    }
  }
}

function validatePluginJson(errors: Issue[], warnings: Issue[]): void {
  const pluginPath = join(ROOT, ".claude-plugin", "plugin.json");
  if (!existsSync(pluginPath)) {
    errors.push({ file: ".claude-plugin/plugin.json", field: "existence", message: "plugin.json not found" });
    return;
  }

  try {
    const content = JSON.parse(readFileSync(pluginPath, "utf-8"));
    if (!content.name) errors.push({ file: ".claude-plugin/plugin.json", field: "name", message: "Missing name" });
    if (!content.version) errors.push({ file: ".claude-plugin/plugin.json", field: "version", message: "Missing version" });
    if (!content.description) errors.push({ file: ".claude-plugin/plugin.json", field: "description", message: "Missing description" });
  } catch (e) {
    errors.push({ file: ".claude-plugin/plugin.json", field: "json", message: `JSON parse error: ${e}` });
  }
}

// --- Main ---

const errors: Issue[] = [];
const warnings: Issue[] = [];

const skillFiles = findSkills();
const agentFiles = findAgents();
const allFiles = [...skillFiles, ...agentFiles];

// Collect skill names
const skillNames = new Set<string>();
for (const f of skillFiles) {
  const content = readFileSync(f, "utf-8");
  const fm = extractFrontmatter(content);
  if (fm) {
    try {
      const parsed = parseYaml(fm.yaml) as Record<string, unknown>;
      if (parsed?.name && typeof parsed.name === "string") {
        skillNames.add(parsed.name);
      }
    } catch {}
  }
}

let passed = 0;
let failed = 0;

for (const f of skillFiles) {
  if (validateFile(f, "skill", errors, warnings)) passed++;
  else failed++;
}

for (const f of agentFiles) {
  if (validateFile(f, "agent", errors, warnings)) passed++;
  else failed++;
}

// Cross-reference check
for (const f of allFiles) {
  crossReferenceCheck(f, skillNames, warnings);
}

// Plugin.json check
validatePluginJson(errors, warnings);

const report: Report = {
  errors,
  warnings,
  summary: { total: allFiles.length, passed, failed },
};

console.log(JSON.stringify(report, null, 2));
process.exit(errors.length > 0 ? 1 : 0);
