// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

/** Calcula percentil discreto em amostra observada. */
function percentile(values, ratio) {
  if (!values.length) return 0;
  const ordered = [...values].map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  return ordered[Math.min(ordered.length - 1, Math.max(0, Math.ceil(ordered.length * ratio) - 1))] || 0;
}

/** Deriva timeout do p95 observado com margem explícita e limites finitos. */
function deriveTimeout(history, options = {}) {
  const margin = Number.isFinite(options.margin) ? options.margin : 0.5;
  const minimum = Number.isFinite(options.minimumMs) ? options.minimumMs : 1000;
  const maximum = Number.isFinite(options.maximumMs) ? options.maximumMs : 3600000;
  const basis = percentile(history, 0.95) || minimum;
  return Math.min(maximum, Math.max(minimum, Math.ceil(basis * (1 + margin))));
}

/** Grava JSON por temporário e rename, mantendo estado retomável. */
function writeState(target, state) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const temporary = `${target}.tmp-${process.pid}-${crypto.randomBytes(3).toString("hex")}`;
  fs.writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  fs.renameSync(temporary, target);
}

/** Executa processo orientado a eventos, sem polling, com timeout e cancelamento distintos. */
function runLongProcess(command, args = [], options = {}) {
  const startedAt = new Date().toISOString();
  const start = Date.now();
  const statePath = options.statePath;
  const timeoutMs = options.timeoutMs || deriveTimeout(options.history || []);
  const base = {
    schema: "agents-long-run/v1", command, args, startedAt, timeoutMs,
    environment: { platform: os.platform(), release: os.release(), arch: os.arch(), node: process.version },
    status: "running",
  };
  if (statePath) writeState(statePath, base);
  return new Promise((resolve, reject) => {
    const child = childProcess.spawn(command, args, {
      cwd: options.cwd || process.cwd(), env: options.env || process.env,
      shell: false, stdio: options.stdio || "ignore", windowsHide: true,
    });
    let settled = false;
    const finish = (status, code, error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (options.signal) options.signal.removeEventListener("abort", cancel);
      const result = { ...base, status, exitCode: Number.isInteger(code) ? code : null, endedAt: new Date().toISOString(), durationMs: Date.now() - start };
      if (error) result.error = error.message || String(error);
      if (statePath) writeState(statePath, result);
      if (status === "completed") resolve(result); else reject(Object.assign(new Error(`LONG_RUN_${status.toLocaleUpperCase("en-US")}`), { result }));
    };
    const cancel = () => { child.kill(); finish("cancelled", null); };
    const timer = setTimeout(() => { child.kill(); finish("timed_out", null); }, timeoutMs);
    child.once("error", (error) => finish("failed", null, error));
    child.once("exit", (code, signal) => finish(code === 0 ? "completed" : "failed", code, signal ? new Error(`signal:${signal}`) : undefined));
    if (options.signal) {
      if (options.signal.aborted) cancel(); else options.signal.addEventListener("abort", cancel, { once: true });
    }
  });
}

/** Retoma sem repetir execução já concluída; estados interrompidos podem ser reexecutados explicitamente. */
function resumeLongProcess(command, args = [], options = {}) {
  if (!options.statePath || !fs.existsSync(options.statePath)) return runLongProcess(command, args, options);
  const previous = JSON.parse(fs.readFileSync(options.statePath, "utf8"));
  if (previous.status === "completed" && previous.command === command && JSON.stringify(previous.args) === JSON.stringify(args)) {
    return Promise.resolve({ ...previous, resumed: false, reused: true });
  }
  return runLongProcess(command, args, { ...options, history: [...(options.history || []), previous.durationMs].filter(Number.isFinite) })
    .then((result) => ({ ...result, resumed: true, previousStatus: previous.status }));
}

/** Executa CLI de observação com estado explícito. */
async function main(argv = process.argv.slice(2)) {
  const separator = argv.indexOf("--");
  if (separator < 1) throw new Error("Uso: long-running <state.json> -- <comando> [args]");
  const statePath = path.resolve(argv[0]);
  const command = argv[separator + 1];
  if (!command) throw new Error("LONG_RUN_COMANDO_AUSENTE");
  const result = await resumeLongProcess(command, argv.slice(separator + 2), { statePath, stdio: "inherit" });
  console.log(JSON.stringify(result));
}

if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });

module.exports = { deriveTimeout, percentile, resumeLongProcess, runLongProcess, writeState };
