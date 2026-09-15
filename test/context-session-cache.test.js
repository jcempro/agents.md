const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  CACHE_SCHEMA,
  clearSessionCache,
  deliverSessionContext,
} = require("../src/.ia.rules/core/runtime/scripts/context-session-cache.ts");

const root = fs.mkdtempSync(path.join(os.tmpdir(), "agents-context-cache-"));
const cacheDir = path.join(root, ".ia.rules", "cache", "context-sessions");

/** Grava fixture contextual normalizada dentro da raiz temporária. */
function fixture(name, content) {
  const target = path.join(root, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
  return name;
}

/** Monta duas unidades relacionadas para exercitar identidade e invalidação transitiva. */
function units(overrides = {}) {
  const common = {
    authority: "AGENTS.md",
    precedence: "core",
    role: ["final", "constructor"],
    route: "always",
    version: "1",
  };
  return [
    { ...common, id: "authority", path: "authority.md", tokens: 11, ...(overrides.authority || {}) },
    { ...common, dependencies: ["authority"], id: "state", path: "state/continue.ia", route: "state", tokens: 17, ...(overrides.state || {}) },
  ];
}

/** Executa a entrega com cache local isolado e tokenizer explicitamente declarado. */
function deliver(sessionId, inputUnits = units(), options = {}) {
  return deliverSessionContext({ cacheDir, rootDir: root, sessionId, tokenizer: "fixture-exact/v1", units: inputUnits, ...options });
}

try {
  fixture("authority.md", "autoridade\n");
  fixture("state/continue.ia", "estado=1\n");

  const cold = deliver("session-a");
  assert.equal(cold.schema, "agents-context-delivery/v1");
  assert.equal(cold.cache.state, "cold");
  assert.equal(cold.metrics.hits, 0);
  assert.equal(cold.metrics.misses, 2);
  assert.equal(cold.metrics.tokensAvoided, 0);
  assert.ok(cold.units.every((unit) => unit.status === "miss" && typeof unit.content === "string"));

  const hit = deliver("session-a");
  assert.equal(hit.cache.state, "hit");
  assert.equal(hit.metrics.hits, 2);
  assert.equal(hit.metrics.tokensAvoided, 28);
  assert.ok(hit.units.every((unit) => unit.status === "hit" && !("content" in unit)));
  const cacheFiles = fs.readdirSync(cacheDir);
  assert.equal(cacheFiles.length, 1);
  const sessionACachePath = path.join(cacheDir, cacheFiles[0]);
  const persisted = JSON.parse(fs.readFileSync(sessionACachePath, "utf8"));
  assert.equal(persisted.schema, CACHE_SCHEMA);
  assert.ok(!JSON.stringify(persisted).includes("autoridade"));
  assert.ok(!JSON.stringify(persisted).includes("estado=1"));

  fixture("authority.md", "autoridade alterada\n");
  const changedHash = deliver("session-a");
  assert.equal(changedHash.metrics.hits, 0);
  assert.equal(changedHash.units[0].reason, "content-changed");
  assert.equal(changedHash.units[1].reason, "dependency-changed");

  assert.equal(deliver("version", units()).cache.state, "cold");
  assert.equal(deliver("version", units({ authority: { version: "2" } })).units[0].reason, "version-changed");
  assert.equal(deliver("role", units()).cache.state, "cold");
  assert.equal(deliver("role", units({ authority: { role: "final" } })).units[0].reason, "role-changed");
  assert.equal(deliver("precedence", units()).cache.state, "cold");
  assert.equal(deliver("precedence", units({ authority: { precedence: "local" } })).units[0].reason, "precedence-changed");
  assert.equal(deliver("route", units()).cache.state, "cold");
  assert.equal(deliver("route", units({ authority: { route: "conditional" } })).units[0].reason, "route-changed");
  assert.equal(deliver("authority", units()).cache.state, "cold");
  assert.equal(deliver("authority", units({ authority: { authority: "LOCAL.md" } })).units[0].reason, "authority-changed");

  const resumed = deliver("session-a");
  assert.equal(resumed.metrics.hits, 2);
  const newSession = deliver("session-b");
  assert.equal(newSession.metrics.hits, 0);
  assert.ok(newSession.units.every((unit) => unit.reason === "cold-context"));

  const reset = deliver("session-a", units(), { reset: true });
  assert.equal(reset.metrics.hits, 0);
  assert.ok(reset.units.every((unit) => unit.reason === "cache-reset"));
  assert.equal(deliver("session-a").metrics.hits, 2);

  fs.writeFileSync(sessionACachePath, "{invalido", "utf8");
  const corrupted = deliver("session-a");
  assert.equal(corrupted.cache.state, "recovered");
  assert.equal(corrupted.metrics.hits, 0);
  assert.ok(corrupted.units.every((unit) => unit.reason === "cache-corrupt" && typeof unit.content === "string"));
  assert.equal(deliver("session-a").metrics.hits, 2);

  const removed = deliver("session-a", [units()[0]]);
  assert.deepEqual(removed.removed, ["state"]);
  assert.equal(removed.metrics.invalidations, 1);
  assert.equal(removed.metrics.reasonCounts["unit-removed"], 1);
  assert.equal(deliver("session-a").units[1].reason, "cold-context");

  const disabled = deliver("unused", units(), { enabled: false });
  assert.equal(disabled.cache.state, "disabled");
  assert.equal(disabled.metrics.hits, 0);
  assert.ok(disabled.units.every((unit) => unit.reason === "cache-disabled"));

  const cleared = clearSessionCache({ cacheDir, rootDir: root, sessionId: "session-a" });
  assert.equal(cleared.changed, true);
  assert.equal(clearSessionCache({ cacheDir, rootDir: root, sessionId: "session-a" }).changed, false);
  assert.equal(deliver("session-a").metrics.hits, 0);

  const blockedCache = fixture("blocked-cache", "arquivo, não diretório\n");
  const recoveredWrite = deliverSessionContext({
    cacheDir: path.join(root, blockedCache, "child"),
    rootDir: root,
    sessionId: "write-error",
    tokenizer: "fixture-exact/v1",
    units: units(),
  });
  assert.equal(recoveredWrite.cache.state, "recovered");
  assert.equal(recoveredWrite.cache.error, "ENOTDIR");
  assert.ok(recoveredWrite.units.every((unit) => unit.reason === "cache-write-error" && typeof unit.content === "string"));

  assert.throws(() => deliver("cycle", [
    { id: "a", path: "authority.md", tokens: 1, dependencies: ["b"] },
    { id: "b", path: "state/continue.ia", tokens: 1, dependencies: ["a"] },
  ]), /CONTEXT_DEPENDENCIA_CICLICA/u);
  assert.throws(() => deliver("escape", [{ id: "escape", path: "../outside", tokens: 1 }]), /CONTEXT_PATH_FORA_DA_RAIZ/u);
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

console.log("context-session-cache.test.js: OK");
