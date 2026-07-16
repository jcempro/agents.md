const assert = require("assert");
const { mergePackageManifest, parseArgs } = require("../.agents/core/runtime/scripts/update-agents");

function main() {
  assert.deepEqual(parseArgs([]), { check: false, dryRun: false, force: false, help: false });
  const local = Buffer.from(JSON.stringify({ name: "consumer", scripts: { "agent:agents": "node scripts/.agents/repo-tools.js agent:agents", publish: "ruby publish.rb" } }));
  const remote = Buffer.from(JSON.stringify({
    scripts: {
      "agent:autoupdate": "node .agents/core/runtime/scripts/repo-tools.js agent:autoupdate",
      "agents:autoupdate": "node .agents/core/runtime/scripts/repo-tools.js agent:autoupdate",
      "agent:agents": "node .agents/core/runtime/scripts/repo-tools.js agent:autoupdate",
      "agents:update": "node .agents/core/runtime/scripts/repo-tools.js agent:autoupdate",
    },
    agentsGovernance: { schema: 1, managedScriptPrefixes: ["agent:"], managedScripts: ["agents:autoupdate", "agents:update"], dependencies: [], optionalDependencies: [] },
  }));
  const merged = JSON.parse(mergePackageManifest(local, remote).toString("utf8"));
  assert.equal(merged.scripts.publish, "ruby publish.rb");
  assert.match(merged.scripts["agent:autoupdate"], /agent:autoupdate/u);
  assert.equal(merged.scripts["agent:agents"], merged.scripts["agent:autoupdate"]);
  assert.equal(merged.scripts["agents:autoupdate"], merged.scripts["agent:autoupdate"]);
  assert.equal(merged.scripts["agents:update"], merged.scripts["agent:autoupdate"]);
}

main();
