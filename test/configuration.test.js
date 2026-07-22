const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { deepMerge, loadConfiguration, parseConfig } = require("../.ia.rules/core/runtime/scripts/configuration");

const root = path.join(__dirname, "..");
const config = loadConfiguration(root);
assert.equal(config.schema, 1);
assert.equal(config.devLive.host, "127.0.0.1");
assert.equal(config.devLive.port, 4000);
assert.equal(config.paths.source, "src");
assert.equal(config.paths.artifact, "dist");
assert.equal(config.metadata.repository, "https://github.com/jcempro/agents.md");
assert.deepEqual(deepMerge({ a: { b: 1, c: 2 } }, { a: { b: 3 } }), { a: { b: 3, c: 2 } });
assert.throws(() => parseConfig("[]", "teste"), /CONFIGURACAO_INVALIDA/u);

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
assert.match(pkg.scripts["update:agents"], /shared:update:agents/u);
assert.match(pkg.scripts.release, /shared:lifecycle:release/u);
assert.match(pkg.scripts.publish, /shared:lifecycle:publish/u);
assert.match(pkg.scripts["agent:autoupdate"], /update:agents/u);
assert.ok(pkg.agentsGovernance.managedScriptPrefixes.includes("shared:"));
