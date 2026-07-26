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
const index = JSON.parse(fs.readFileSync(path.join(root, "src", ".ia.rules", "normative-index.json"), "utf8"));
const entrypointNode = index.nodes.find((node) => node.id === "core.agents");
const auxiliaryNode = index.nodes.find((node) => node.id === "core.agents-full");

assert.equal(activeEntrypoint, sourceEntrypoint);
assert.equal(activeAuxiliary, sourceAuxiliary);
assert.equal(hash(activeAuxiliary), "4bd38947f9071855ecb4ae9fa9bae6a9f1fd802117f134373a66a029d4d95024");
assert.ok(entrypointNode && entrypointNode.tokens <= 500);
assert.ok(auxiliaryNode && auxiliaryNode.tokens === 7364);
assert.equal(auxiliaryNode.sha256, hash(sourceAuxiliary));
assert.ok(index.edges.some((edge) => edge.from === "core.agents" && edge.to === "core.agents-full" && edge.mode === "passive"));
assert.match(activeEntrypoint, /\.ia\.rules\/normative-index\.json/u);
assert.match(activeEntrypoint, /\.ia\.rules\/agents\.inc\.md/u);
assert.match(activeEntrypoint, /papel Construtor/u);
assert.doesNotMatch(activeEntrypoint, /^## 18\. API operacional/mu);

console.log("agents-entrypoint.test.js: OK");
