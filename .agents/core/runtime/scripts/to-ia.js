// Autor: JeanCarloEM.com
// Licenca: Mozilla Public License 2.0
// Interface deterministica de preparo de saida para IA.

const crypto = require("crypto");
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const OUTPUT_DIR = path.join(ROOT_DIR, ".agents", "cache", "outputs");
const MAX_BYTES = 8192;
const MAX_LINES = 50;
const LEVEL_ORDER = ["fatal", "error", "warning", "change", "result", "metric", "info", "debug"];

function normalize(value) {
  return String(value || "")
    .replace(/\r\n?/gu, "\n")
    .replace(/\x1B\[[0-?]*[ -/]*[@-~]/gu, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/gu, "");
}

function levelOf(line) {
  if (/\b(fatal|panic)\b/iu.test(line)) return "fatal";
  if (/\b(error|erro|exception|falhou|failure)\b/iu.test(line)) return "error";
  if (/\b(warning|warn|aviso)\b/iu.test(line)) return "warning";
  if (/\b(changed|change|alterad[oa]|cri(?:ad[oa]|ou)|removid[oa])\b/iu.test(line)) return "change";
  if (/\b(ok|success|resultado|result)\b/iu.test(line)) return "result";
  if (/\b(metric|total|bytes|lines|tempo|ms)\b/iu.test(line)) return "metric";
  if (/\b(debug|trace|verbose)\b/iu.test(line)) return "debug";
  return "info";
}

function codeOf(level) {
  return `TO_IA_${level.toUpperCase()}`;
}

function orderRecords(records) {
  return records
    .map((record, index) => ({ ...record, index }))
    .sort((left, right) => LEVEL_ORDER.indexOf(left.level) - LEVEL_ORDER.indexOf(right.level) || left.index - right.index)
    .map(({ index, ...record }) => record);
}

function deduplicate(lines) {
  const result = [];
  let previous = null;
  let duplicates = 0;
  for (const line of lines) {
    if (line === previous) {
      duplicates += 1;
      continue;
    }
    if (duplicates > 0) result.push(`[to-ia: linha anterior repetida ${duplicates} vez(es)]`);
    result.push(line);
    previous = line;
    duplicates = 0;
  }
  if (duplicates > 0) result.push(`[to-ia: linha anterior repetida ${duplicates} vez(es)]`);
  return result;
}

function persist(command, content) {
  const sha256 = crypto.createHash("sha256").update(content, "utf8").digest("hex");
  const stamp = new Date().toISOString().replace(/[-:TZ.]/gu, "").slice(0, 14).replace(/^(\d{8})(\d{6})$/u, "$1.$2");
  const safeCommand = String(command || "command").replace(/[^A-Za-z0-9._-]/gu, "-");
  const relative = path.posix.join(".agents", "cache", "outputs", `${stamp}-${safeCommand}-${sha256.slice(0, 12)}.log`);
  const target = path.join(ROOT_DIR, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
  return { path: relative, sha256 };
}

function limit(records, envelope) {
  const shown = [];
  let shortened = false;
  let bytes = Buffer.byteLength(`${JSON.stringify(envelope)}\n`, "utf8");
  for (const record of records) {
    if (shown.length >= MAX_LINES - 1) break;
    const encoded = JSON.stringify(record);
    const available = MAX_BYTES - bytes - 1;
    if (available <= 0) break;
    if (Buffer.byteLength(encoded, "utf8") > available) {
      const suffix = " [truncated]";
      let message = record.message;
      while (message && Buffer.byteLength(JSON.stringify({ ...record, code: "TO_IA_TRUNCATED", message: `${message}${suffix}` }), "utf8") > available) {
        message = message.slice(0, -1);
      }
      if (!message) break;
      const shortRecord = { ...record, code: "TO_IA_TRUNCATED", message: `${message}${suffix}` };
      shown.push(shortRecord);
      bytes += Buffer.byteLength(`${JSON.stringify(shortRecord)}\n`, "utf8");
      shortened = true;
      break;
    }
    shown.push(record);
    bytes += Buffer.byteLength(`${encoded}\n`, "utf8");
  }
  return { shown, shortened };
}

function filterOutput({ command = "agent:filter", exit = 0, stderr = "", stdout = "" } = {}) {
  const normalized = normalize(`${stdout}${stderr ? `\n${stderr}` : ""}`);
  const allLines = deduplicate(normalized.split("\n").filter(Boolean));
  const records = orderRecords(allLines.map((message) => ({ code: codeOf(levelOf(message)), level: levelOf(message), message })));
  const visible = records.filter((record) => record.level !== "debug");
  const provisional = {
    v: 1,
    command,
    status: exit === 0 ? "ok" : "error",
    exit,
    totalLines: allLines.length,
    totalBytes: Buffer.byteLength(normalized, "utf8"),
    shown: 0,
    truncated: false,
    artifact: "",
    sha256: crypto.createHash("sha256").update(normalized, "utf8").digest("hex"),
  };
  const initial = limit(visible, provisional);
  const truncated = initial.shown.length !== visible.length || records.length !== visible.length || initial.shortened;
  const retained = truncated ? persist(command, normalized) : null;
  const envelope = {
    ...provisional,
    shown: initial.shown.length,
    truncated,
    artifact: retained ? retained.path : "",
    sha256: retained ? retained.sha256 : provisional.sha256,
  };
  const final = limit(visible, envelope);
  envelope.shown = final.shown.length;
  envelope.truncated = truncated || final.shown.length !== visible.length || final.shortened;
  if (envelope.truncated && !envelope.artifact) {
    const artifact = persist(command, normalized);
    envelope.artifact = artifact.path;
    envelope.sha256 = artifact.sha256;
  }
  return `${[envelope, ...final.shown].map((record) => JSON.stringify(record)).join("\n")}\n`;
}

function parseArgs(argv) {
  const args = { command: "agent:filter", exit: 0 };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--help") {
      args.help = true;
    } else if (value === "--command") {
      args.command = argv[++index] || "";
      if (!args.command) throw new Error("PARAMETRO_NORMATIVO_AUSENTE:command");
    } else if (value === "--exit") {
      args.exit = Number(argv[++index]);
      if (!Number.isInteger(args.exit)) throw new Error("PARAMETRO_INVALIDO:exit");
    } else if (value === "--run") {
      args.run = argv.slice(index + 1);
      break;
    } else {
      throw new Error(`PARAMETRO_INVALIDO:${value}`);
    }
  }
  return args;
}

function help() {
  return "Uso: node to-ia.js [--command <nome>] [--exit <codigo>] [--run <comando> [args...]]\n";
}

if (require.main === module) {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stdout.write(filterOutput({ exit: 2, stderr: error.message }));
    process.exitCode = 2;
    return;
  }
  if (args.help) {
    process.stdout.write(help());
    return;
  }
  if (args.run) {
    const [command, ...commandArgs] = args.run;
    if (!command) {
      process.stdout.write(filterOutput({ ...args, exit: 2, stderr: "PARAMETRO_NORMATIVO_AUSENTE:command" }));
      process.exitCode = 2;
    } else {
      const result = childProcess.spawnSync(command, commandArgs, { cwd: ROOT_DIR, encoding: "utf8", shell: false });
      process.stdout.write(filterOutput({
        command: args.command === "agent:filter" ? `to-ia:${command}` : args.command,
        exit: Number.isInteger(result.status) ? result.status : 1,
        stderr: `${result.stderr || ""}${result.error ? `\n${result.error.message}` : ""}`,
        stdout: result.stdout || "",
      }));
      process.exitCode = Number.isInteger(result.status) ? result.status : 1;
    }
    return;
  }
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", () => { process.stdout.write(filterOutput({ ...args, stdout: input })); });
}

module.exports = { filterOutput, help, normalize, parseArgs };
