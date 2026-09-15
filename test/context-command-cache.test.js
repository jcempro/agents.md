const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const runtimePath = path.join(root, ".ia.rules", "core", "runtime", "scripts", "repo-tools.js");
const session = `test-${process.pid}-${Date.now()}`;

/** Captura a saída JSON do comando oficial sem passar pelo filtro textual do processo CLI. */
function invoke(args) {
  const lines = [];
  const original = console.log;
  console.log = (value) => lines.push(String(value));
  try {
    const result = require(runtimePath).main(["agent:context", ...args]);
    assert.equal(result, 0);
  } finally {
    console.log = original;
  }
  assert.equal(lines.length, 1);
  return JSON.parse(lines[0]);
}

try {
  const legacy = invoke([]);
  assert.ok(legacy.normativeFiles.length > 100);
  assert.equal("contextCache" in legacy, false);

  const cold = invoke(["--session", session, "--reset-cache"]);
  assert.equal(cold.contextCache.state, "cold");
  assert.equal(cold.contextCache.hits, 0);
  assert.equal(cold.contextCache.misses, cold.normativeFiles.length);
  assert.ok(cold.contextCache.misses > 100);
  assert.equal(cold.contextCache.payloadStored, false);

  const hit = invoke(["--session", session]);
  assert.equal(hit.contextCache.state, "hit");
  assert.equal(hit.contextCache.misses, 0);
  assert.equal(hit.contextCache.hits, cold.contextCache.misses);
  assert.equal(hit.normativeFiles.length, 0);
  assert.match(hit.contextCache.reusedFingerprint, /^[a-f0-9]{64}$/u);
  assert.ok(hit.contextCache.tokensAvoided > 0);

  const disabled = invoke(["--session", session, "--no-cache"]);
  assert.equal(disabled.contextCache.state, "disabled");
  assert.equal(disabled.contextCache.hits, 0);
  assert.equal(disabled.normativeFiles.length, cold.normativeFiles.length);

  assert.throws(() => invoke(["--reset-cache"]), /CONTEXT_SESSION_AUSENTE|CONTEXT_RESET_SEM_SESSION/u);
} finally {
  const digest = crypto.createHash("sha256").update(session, "utf8").digest("hex");
  const target = path.join(root, ".ia.rules", "cache", "context-sessions", `${digest}.json`);
  try { fs.rmSync(target); } catch (error) { if (!error || error.code !== "ENOENT") throw error; }
}

console.log("context-command-cache.test.js: OK");
