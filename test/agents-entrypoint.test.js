const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const readLf = (filePath) => fs.readFileSync(filePath, "utf8").replace(/\r\n/gu, "\n");
const hash = (content) => crypto.createHash("sha256").update(content, "utf8").digest("hex");

const activeEntrypoint = readLf(path.join(root, "AGENTS.md"));
const sourceEntrypoint = readLf(path.join(root, "src", "AGENTS.md"));
const activeAuxiliary = readLf(path.join(root, ".ia.rules", "agents.inc.md"));
const sourceAuxiliary = readLf(path.join(root, "src", ".ia.rules", "agents.inc.md"));
const distributedEntrypoint = readLf(path.join(root, "dist", "AGENTS.md"));
const distributedAuxiliary = readLf(path.join(root, "dist", ".ia.rules", "agents.inc.md"));
const index = JSON.parse(fs.readFileSync(path.join(root, "src", ".ia.rules", "normative-index.json"), "utf8"));
const entrypointNode = index.nodes.find((node) => node.id === "core.agents");
const auxiliaryNode = index.nodes.find((node) => node.id === "core.agents-full");

assert.equal(activeEntrypoint, sourceEntrypoint);
assert.equal(activeAuxiliary, sourceAuxiliary);
assert.equal(distributedEntrypoint, sourceEntrypoint);
assert.equal(distributedAuxiliary, sourceAuxiliary);
assert.equal(hash(activeAuxiliary), "beab28c8fbad8bbffd2a8dc1c35f7af85ff7386ef9b4ab27f990cfde2a9ebaf0");
assert.ok(entrypointNode && entrypointNode.tokens <= 400);
assert.ok(auxiliaryNode && auxiliaryNode.tokens === 8035);
assert.equal(auxiliaryNode.sha256, hash(sourceAuxiliary));
assert.ok(index.edges.some((edge) => edge.from === "core.agents" && edge.to === "core.agents-full" && edge.mode === "passive"));
assert.match(activeEntrypoint, /\.ia\.rules\/normative-index\.json/u);
assert.match(activeEntrypoint, /\.ia\.rules\/agents\.inc\.md/u);
assert.match(activeEntrypoint, /papel Construtor/u);
assert.doesNotMatch(activeEntrypoint, /^## 18\. API operacional/mu);

const directUnits = [
  "resource.skills",
  "resource.subagents",
  "resource.long-running",
  "resource.external-tools",
  "scenario.state-and-todo",
  "scenario.visual-precision",
];
for (const id of directUnits) {
  const node = index.nodes.find((candidate) => candidate.id === id);
  assert.ok(node && node.type === "leaf", `unidade normativa ausente ou não terminal: ${id}`);
  assert.ok(index.edges.some((edge) => edge.from === "core.agents" && edge.to === id && edge.mode === "passive"));
}

const sourceManifest = JSON.parse(fs.readFileSync(path.join(root, "src", ".ia.rules", "distribution", "source-manifest.json"), "utf8"));
for (const relativePath of [
  ".ia.rules/core/formats/skill-descriptor.v1.schema.json",
  ".ia.rules/core/formats/subagent-descriptor.v1.schema.json",
  ".ia.rules/resources/skills.md",
  ".ia.rules/resources/subagents.md",
  ".ia.rules/resources/long-running.md",
  ".ia.rules/resources/external-tools.md",
  ".ia.rules/scenarios/governance/state-and-todo.md",
  ".ia.rules/scenarios/visual/precision.md",
]) {
  assert.ok(sourceManifest.entries.some((entry) => entry.path === relativePath && entry.destination === relativePath));
  assert.equal(readLf(path.join(root, "src", relativePath)), readLf(path.join(root, relativePath)));
}

for (const schemaName of ["skill-descriptor.v1.schema.json", "subagent-descriptor.v1.schema.json"]) {
  const schema = JSON.parse(fs.readFileSync(path.join(root, "src", ".ia.rules", "core", "formats", schemaName), "utf8"));
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.additionalProperties, false);
  assert.ok(Array.isArray(schema.required) && schema.required.length >= 20);
}

console.log("agents-entrypoint.test.js: OK");
