const fs = require("fs");
const path = require("path");
const { requestJson, sanitizeText } = require("./public-client");
const { normalizeIssue, persistRecord } = require("./issue-inbox");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const MEMORY_PATH = path.join(ROOT_DIR, ".agents", "continue.ia");
const GITHUB_API = "https://api.github.com";

async function main(argv = process.argv.slice(2)) {
  const [command = "", ...rest] = argv;
  const options = parseArgs(rest);
  if (command === "--help" || options.help) return print(help());
  if (command === "sync-approved") return print(await syncApproved(options));
  if (command === "start") return print(await transitionDevelopment(options));
  if (command === "bind-release") return print(bindRelease(required(options.version || options.positionals[0], "version"), options));
  if (command === "complete-release") return print(await completeRelease(required(options.version || options.positionals[0], "version"), options));
  throw new UsageError(`COMANDO_CICLO_ISSUE_INVALIDO:${command || "(vazio)"}`);
}

async function syncApproved(options = {}) {
  assertConstructor(options);
  const config = readConfig();
  const repository = repositoryFrom(config);
  const token = required(process.env.AGENTS_GITHUB_TOKEN, "AGENTS_GITHUB_TOKEN");
  const response = await github(config, `/repos/${repository}/issues?state=open&labels=${encodeURIComponent("agents:approved")}&per_page=100`, "GET", { token });
  if (!response.ok) return { code: "ISSUE_SYNC_UNAVAILABLE", remote: projectResponse(response) };
  const issues = Array.isArray(response.data) ? response.data.filter((issue) => !issue.pull_request) : [];
  const memory = readMemory();
  const imported = [];
  let nextFt = maxFt(memory) + 1;
  let updated = memory;
  for (const issue of issues.sort((left, right) => Number(left.number) - Number(right.number))) {
    const issueId = `github:${repository}#${issue.number}`;
    if (updated.includes(`issue_id=${issueId}`)) continue;
    const record = normalizeIssue({ full_name: repository }, issue, "approved-sync");
    persistRecord(record, options);
    const ft = `FT-${String(nextFt).padStart(3, "0")}`;
    updated = appendFront(updated, buildFront({ ft, issue, issueId, repository }));
    imported.push({ ft, issue: Number(issue.number), issueId });
    nextFt += 1;
  }
  if (imported.length && !options.dryRun) writeMemory(updated);
  return { code: "APPROVED_ISSUES_SYNCED", imported, published: false, scanned: issues.length };
}

async function transitionDevelopment(options = {}) {
  assertMutation(options);
  const config = readConfig();
  const token = options.dryRun ? "" : required(process.env.AGENTS_GITHUB_TOKEN, "AGENTS_GITHUB_TOKEN");
  const memory = readMemory();
  const targets = correlatedFronts(memory).filter((front) => front.issueState === "aprovada" && (!options.ft || front.ft === normalizeFt(options.ft)));
  if (options.ft && targets.length === 0) throw new Error(`FT_SEM_ISSUE_APROVADA:${normalizeFt(options.ft)}`);
  const completed = [];
  for (const target of targets) {
    if (!options.dryRun) await markDevelopment(config, target, token);
    completed.push(target);
  }
  if (completed.length && !options.dryRun) writeMemory(updateIssueStates(memory, completed, "em_desenvolvimento"));
  return { code: options.dryRun ? "ISSUE_START_DRY_RUN" : "ISSUES_IN_DEVELOPMENT", issues: completed.map(publicTarget), published: !options.dryRun };
}

function bindRelease(versionValue, options = {}) {
  const version = normalizeVersion(versionValue);
  const memory = readMemory();
  const targets = correlatedFronts(memory).filter((front) => front.status === "concluido" && front.issueState === "em_desenvolvimento" && front.release === "pendente");
  const updated = targets.reduce((text, target) => replaceFieldInFront(text, target.ft, "release", version), memory);
  if (targets.length && !options.dryRun) writeMemory(updated);
  return { code: "ISSUES_BOUND_TO_RELEASE", issues: targets.map(publicTarget), version, written: Boolean(targets.length && !options.dryRun) };
}

async function completeRelease(versionValue, options = {}) {
  assertMutation(options);
  const version = normalizeVersion(versionValue);
  const config = readConfig();
  const token = options.dryRun ? "" : required(process.env.AGENTS_GITHUB_TOKEN, "AGENTS_GITHUB_TOKEN");
  const memory = readMemory();
  const targets = correlatedFronts(memory).filter((front) => front.status === "concluido" && front.release === version && front.issueState === "em_desenvolvimento");
  for (const target of targets) if (!options.dryRun) await markFixed(config, target, version, token);
  if (targets.length && !options.dryRun) writeMemory(updateIssueStates(memory, targets, "corrigida"));
  return { code: options.dryRun ? "ISSUE_RELEASE_DRY_RUN" : "RELEASE_ISSUES_COMPLETED", issues: targets.map(publicTarget), published: !options.dryRun, version };
}

async function markDevelopment(config, target, token) {
  await ensureLabel(config, target.repository, "agents:in-development", "fbca04", "Issue em implementação", token);
  await addIssueLabel(config, target, "agents:in-development", token);
  await ensureComment(config, target, `Implementação iniciada. FT: ${target.ft}.`, `<!-- agents-development:${target.issue}:${target.ft} -->`, token);
}

async function markFixed(config, target, version, token) {
  await ensureLabel(config, target.repository, "agents:fixed", "0e8a16", "Correção publicada", token);
  await addIssueLabel(config, target, "agents:fixed", token);
  await ensureComment(config, target, `Correção publicada no release v${version}. FT: ${target.ft}.`, `<!-- agents-fixed:${target.issue}:${target.ft}:v${version} -->`, token);
  const closed = await github(config, `/repos/${target.repository}/issues/${target.issue}`, "PATCH", { body: JSON.stringify({ state: "closed", state_reason: "completed" }), token });
  if (!closed.ok) throw new Error(`ISSUE_CLOSE_FAILED:${target.issue}:${closed.code}`);
}

async function ensureLabel(config, repository, name, color, description, token) {
  const current = await github(config, `/repos/${repository}/labels/${encodeURIComponent(name)}`, "GET", { token });
  if (current.ok) return;
  if (current.status !== 404) throw new Error(`ISSUE_LABEL_CHECK_FAILED:${name}:${current.code}`);
  const created = await github(config, `/repos/${repository}/labels`, "POST", { body: JSON.stringify({ color, description, name }), token });
  if (!created.ok && created.status !== 422) throw new Error(`ISSUE_LABEL_CREATE_FAILED:${name}:${created.code}`);
}

async function addIssueLabel(config, target, label, token) {
  const result = await github(config, `/repos/${target.repository}/issues/${target.issue}/labels`, "POST", { body: JSON.stringify({ labels: [label] }), token });
  if (!result.ok) throw new Error(`ISSUE_LABEL_FAILED:${target.issue}:${result.code}`);
}

async function ensureComment(config, target, message, marker, token) {
  const comments = await github(config, `/repos/${target.repository}/issues/${target.issue}/comments?per_page=100`, "GET", { token });
  if (!comments.ok) throw new Error(`ISSUE_COMMENT_CHECK_FAILED:${target.issue}:${comments.code}`);
  if (Array.isArray(comments.data) && comments.data.some((entry) => String(entry.body || "").includes(marker))) return;
  const result = await github(config, `/repos/${target.repository}/issues/${target.issue}/comments`, "POST", { body: JSON.stringify({ body: `${message}\n\n${marker}` }), token });
  if (!result.ok) throw new Error(`ISSUE_COMMENT_FAILED:${target.issue}:${result.code}`);
}

function buildFront({ ft, issue, issueId, repository }) {
  const title = sanitizeText(String(issue.title || "Issue aprovada")).replace(/[\r\n|=]+/gu, " ").slice(0, 180);
  return [
    `${ft}|nome=${title}|escopo=Tecnico|prioridade=alta|status=em_andamento|inicio=${timestamp()}|atualizacao=${timestamp()}`,
    `objetivo=Implementar a issue aprovada ${issueId} com rastreabilidade ate o release.`,
    `issue_id=${issueId}`,
    `issue_repo=${repository}`,
    `issue_number=${issue.number}`,
    `issue_url=https://github.com/${repository}/issues/${issue.number}`,
    "issue_state=aprovada",
    "release=pendente",
    "1/3 Analise e plano [pendente]",
    "  1/2 Validar escopo e criterios de aceite da issue [pendente]",
    "  2/2 Atualizar plano e contratos aplicaveis [pendente]",
    "2/3 Implementacao e validacao [pendente]",
    "  1/2 Implementar sem regressao [pendente]",
    "  2/2 Executar validacoes proporcionais [pendente]",
    "3/3 Entrega [pendente]",
    "  1/2 Commitar e publicar desenvolvimento [pendente]",
    "  2/2 Incluir em release e encerrar issue [pendente]",
    "pendencias=Iniciar desenvolvimento e executar o plano da issue.",
  ].join("\n");
}

function correlatedFronts(memory) {
  return splitFronts(memory).map((block) => ({
    block,
    ft: (block.match(/^(FT-\d+)\|/mu) || [])[1] || "",
    status: (block.match(/^FT-\d+\|.*\|status=([^|\r\n]+)/mu) || [])[1] || "",
    issueId: field(block, "issue_id"),
    repository: field(block, "issue_repo"),
    issue: Number(field(block, "issue_number")),
    issueState: field(block, "issue_state"),
    release: field(block, "release"),
  })).filter((front) => front.issueId && front.repository && front.issue);
}

function splitFronts(memory) { return String(memory).split(/(?=^FT-\d+\|)/mu).filter((block) => /^FT-\d+\|/u.test(block)); }
function field(block, name) { return (block.match(new RegExp(`^${name}=([^\\r\\n]*)`, "mu")) || [])[1] || ""; }
function appendFront(memory, front) { return `${String(memory).trimEnd()}\n\n${front}\n`; }
function maxFt(memory) { return Math.max(0, ...Array.from(String(memory).matchAll(/^FT-(\d+)\|/gmu), (match) => Number(match[1]))); }
function updateIssueStates(memory, targets, state) { return targets.reduce((text, target) => replaceFieldInFront(text, target.ft, "issue_state", state), memory); }
function replaceFieldInFront(memory, ft, name, value) { return String(memory).replace(new RegExp(`(^${ft}\\|[\\s\\S]*?^${name}=)[^\\r\\n]*(?=\\r?$|\\n)(?=[\\s\\S]*?(?:^FT-\\d+\\||$))`, "mu"), `$1${value}`); }
function publicTarget(target) { return { ft: target.ft, issue: target.issue, issueId: target.issueId, repository: target.repository }; }
function normalizeFt(value) { const ft = String(value || "").toUpperCase(); if (!/^FT-\d{3,}$/u.test(ft)) throw new UsageError("PARAMETRO_INVALIDO:ft"); return ft; }
function normalizeVersion(value) { const version = String(value || "").trim(); if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(version)) throw new UsageError("PARAMETRO_INVALIDO:version"); return version; }
function timestamp() { const now = new Date(); return now.toISOString().replace(/[-:TZ]/gu, "").slice(0, 14).replace(/^(\d{8})(\d{6})$/u, "$1.$2"); }
function readMemory() { return fs.readFileSync(MEMORY_PATH, "utf8"); }
function writeMemory(value) { fs.writeFileSync(MEMORY_PATH, String(value).replace(/\r?\n/gu, "\r\n"), "utf8"); }
function repositoryFrom(config) { const repository = String(config.upstreamRepository || ""); if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(repository)) throw new UsageError("REPOSITORIO_ISSUE_INVALIDO"); return repository; }
function readConfig() { const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8")); const local = path.join(ROOT_DIR, ".agents", "upstream.json"); return { ...(pkg.agentsUpstream || {}), ...(fs.existsSync(local) ? JSON.parse(fs.readFileSync(local, "utf8")) : {}) }; }
function assertConstructor(options) { const role = options.role || readConfig().role; if (role !== "constructor" && role !== "dual") throw new Error("PAPEL_CONSTRUTOR_EXPLICITO_EXIGIDO"); }
function assertMutation(options) { assertConstructor(options); if (!options.authorize) throw new Error("AUTORIZACAO_EXPLICITA_EXIGIDA"); }
async function github(config, pathname, method, options = {}) { return requestJson({ body: options.body, headers: { "User-Agent": "agents-governance-lifecycle", ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) }, maxBytes: config.maxBytes, method, retries: method === "GET" ? config.retries : 0, timeoutMs: config.timeoutMs, url: `${String(config.githubApi || GITHUB_API).replace(/\/$/u, "")}${pathname}` }); }
function projectResponse(response) { return { code: response.code, ok: response.ok, status: response.status }; }
function required(value, name) { if (!String(value || "").trim()) throw new UsageError(`PARAMETRO_NORMATIVO_AUSENTE:${name}`); return value; }
function parseArgs(argv) { const result = { positionals: [] }; for (let i = 0; i < argv.length; i += 1) { const value = argv[i]; if (value === "--authorize") result.authorize = true; else if (value === "--dry-run") result.dryRun = true; else if (value === "--help") result.help = true; else if (value === "--role") result.role = argv[++i]; else if (value === "--ft") result.ft = argv[++i]; else if (value === "--version") result.version = argv[++i]; else if (value === "--inbox-dir") result.inboxDir = argv[++i]; else if (value.startsWith("--")) throw new UsageError(`PARAMETRO_DESCONHECIDO:${value}`); else result.positionals.push(value); } return result; }
function help() { return "Uso: issue-lifecycle <sync-approved|start [--ft FT-NNN]|bind-release <versao>|complete-release <versao>> --role constructor [--authorize|--dry-run]\n"; }
function print(value) { console.log(JSON.stringify(value)); return 0; }
class UsageError extends Error { constructor(message) { super(message); this.exitCode = 2; } }

if (require.main === module) main().then((code) => { process.exitCode = code; }).catch((error) => { console.error(error.message); process.exitCode = error.exitCode || 1; });

module.exports = { bindRelease, buildFront, correlatedFronts, main, normalizeFt, normalizeVersion };
