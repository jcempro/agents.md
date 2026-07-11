// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido "AS IS", sem garantias de qualquer tipo.

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const HOOK_PATH = path.join(ROOT_DIR, ".agents", "hooks", "release.js");
const EVENTS = new Set(["prepare", "verify", "published"]);

function runReleaseHook(event, payload = {}) {
  if (!EVENTS.has(event) || !fs.existsSync(HOOK_PATH)) {
    return { event, executed: false };
  }

  // PROTECAO: hook recebe uma copia congelada para impedir mutacao acidental do fluxo comum.
  const hook = require(HOOK_PATH);
  const handler = typeof hook === "function" ? hook : hook && hook[event];

  if (typeof handler !== "function") {
    return { event, executed: false };
  }

  const result = handler(deepFreeze(JSON.parse(JSON.stringify(payload))));
  if (result && typeof result.then === "function") {
    throw new Error("Hook de release assincrono nao e suportado.");
  }
  return { event, executed: true, result: result || null };
}

function deepFreeze(value) {
  if (value && typeof value === "object") {
    Object.freeze(value);
    for (const item of Object.values(value)) {
      deepFreeze(item);
    }
  }
  return value;
}

if (require.main === module) {
  const [event, version = "", asset = ""] = process.argv.slice(2);
  try {
    const result = runReleaseHook(event, { asset, version });
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { EVENTS, HOOK_PATH, runReleaseHook };
