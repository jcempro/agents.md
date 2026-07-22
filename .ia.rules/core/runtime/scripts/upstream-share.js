// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { loadConfiguration } = require("./configuration");
const { requestJson, sanitizeText } = require("./public-client");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const CONFIGURATION = loadConfiguration(ROOT_DIR);
const CONFIG_PATH = path.join(ROOT_DIR, ".ia.rules", "upstream.json");
const PROPOSAL_DIR = path.join(ROOT_DIR, ".ia.rules", "local", "upstream", "proposals");
const CACHE_DIR = path.join(ROOT_DIR, ".ia.rules", "cache", "upstream");
const GITHUB_API = CONFIGURATION.publicServices.githubApi;

async function main(argv = process.argv.slice(2)) {
  const [command = "", ...rest] = argv;
  const options = parseArgs(rest);
  if (command === "--help" || options.help) return print(help());
  if (command === "check") return check(options);
  if (command === "prepare") return prepare(options);
  if (command === "publish") return publish(options);
  if (command === "assess") return assess(options);
  if (command === "apply-assessment") return applyAssessment(options);
  if (command === "self-test") return selfTest();
  throw new UsageError(`COMANDO_UPSTREAM_INVALIDO:${command || "(vazio)"}`);
}

async function check(options) {
  const config = readConfig();
  const identity = resolveIdentity(config);
  const result = { code: "UPSTREAM_CHECK_OK", identity, offline: options.offline, upstream: resolveUpstream(config) };
  if (options.offline) return print(result);
  if (!result.upstream.repository) return print({ ...result, code: "UPSTREAM_UNRESOLVED", reason: "Nenhum destino configurado e validado." });
  const repository = await github(config, `/repos/${result.upstream.repository}`, "GET");
  result.repository = projectResponse(repository);
  if (!repository.ok) return print({ ...result, code: "UPSTREAM_UNAVAILABLE" });
  const release = await github(config, `/repos/${result.upstream.repository}/releases/latest`, "GET");
  result.release = projectResponse(release);
  if (config.npmPackage) {
    const npm = await requestJson({ cachePath: path.join(CACHE_DIR, "npm.json"), url: `https://registry.npmjs.org/${encodeURIComponent(config.npmPackage)}/latest` });
    result.npm = projectResponse(npm);
  }
  return print(result);
}

function prepare(options) {
  const evidencePath = required(options.positionals[0], "evidence");
  const evidence = readJson(evidencePath);
  const config = readConfig();
  const identity = resolveIdentity(config);
  if (identity.role === "constructor" || identity.role === "dual") {
    throw new Error("PROPOSTA_CONSUMIDOR_EXIGE_PAPEL_CONSUMIDOR_SEPARADO");
  }
  const proposal = sanitizeProposal({
    ...evidence,
    createdAt: new Date().toISOString(),
    identity,
    upstream: resolveUpstream(config),
    schema: 1,
  });
  validateProposal(proposal, false);
  const hash = sha256(JSON.stringify(proposal));
  const file = path.join(PROPOSAL_DIR, `${hash.slice(0, 16)}.json`);
  fs.mkdirSync(PROPOSAL_DIR, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(proposal), "utf8");
  return print({ code: "UPSTREAM_PROPOSAL_PREPARED", file: relative(file), hash, title: proposal.title });
}

async function publish(options) {
  requireAuthorization(options);
  const proposal = readProposal(required(options.positionals[0], "proposal"));
  const config = readConfig();
  const identity = resolveIdentity(config);
  const upstream = resolveUpstream(config);
  validatePublishable(identity, upstream, proposal);
  const duplicate = await searchDuplicate(config, upstream.repository, proposal.title);
  if (duplicate.ok && Array.isArray(duplicate.data.items) && duplicate.data.items.length) {
    return print({ code: "UPSTREAM_DUPLICATE_FOUND", duplicate: duplicate.data.items[0].html_url || "", published: false });
  }
  const created = await github(config, `/repos/${upstream.repository}/issues`, "POST", {
    body: JSON.stringify({ body: issueBody(proposal), title: `[AGENTS] ${proposal.title}` }),
    token: requiredEnv("AGENTS_GITHUB_TOKEN"),
  });
  if (!created.ok) throw new Error(`ISSUE_PUBLICATION_FAILED:${created.code}`);
  const record = {
    code: "UPSTREAM_ISSUE_PUBLISHED",
    date: new Date().toISOString(),
    destination: upstream.repository,
    evidenceHash: sha256(JSON.stringify(proposal.evidence || {})),
    issue: created.data.number,
    proposal: relative(options.positionals[0]),
    scenario: proposal.scenario || "",
    status: "published",
    url: created.data.html_url || "",
    version: proposal.version || "",
  };
  persistRecord(record);
  return print(record);
}

function assess(options) {
  const proposal = readProposal(required(options.positionals[0], "proposal"));
  const score = [proposal.context, proposal.gap, proposal.proposal, proposal.reuse, proposal.acceptance, proposal.evidence]
    .filter((value) => String(value || "").trim()).length;
  const grade = score <= 1 ? "rejected" : score <= 3 ? "not_recommended" : score === 4 ? "recommended" : "highly_recommended";
  const language = proposal.language || "pt-BR";
  const message = assessmentMessage(grade, language);
  const assessment = { code: "UPSTREAM_ASSESSMENT", grade, language, label: grade === "recommended" ? "agents:recommended" : grade === "highly_recommended" ? "agents:highly-recommended" : "", message, proposal: relative(options.positionals[0]), score, schema: 1 };
  const file = `${String(options.positionals[0]).replace(/\.json$/u, "")}.assessment.json`;
  fs.writeFileSync(file, JSON.stringify(assessment), "utf8");
  return print({ ...assessment, file: relative(file) });
}

async function applyAssessment(options) {
  requireAuthorization(options);
  const assessment = readJson(required(options.positionals[0], "assessment"));
  const issue = positiveInt(required(options.issue, "issue"), "issue");
  if (!["recommended", "highly_recommended"].includes(assessment.grade)) {
    return print({ code: "UPSTREAM_ASSESSMENT_RECORDED", published: false, reason: "Grau nao exige rotulo nem notificacao." });
  }
  const config = readConfig();
  const upstream = resolveUpstream(config);
  if (!upstream.repository) throw new Error("UPSTREAM_UNRESOLVED");
  const token = requiredEnv("AGENTS_GITHUB_TOKEN");
  const label = config.labels && config.labels[assessment.grade] || assessment.label;
  const labeled = await github(config, `/repos/${upstream.repository}/issues/${issue}/labels`, "POST", { body: JSON.stringify({ labels: [label] }), token });
  if (!labeled.ok) throw new Error(`ISSUE_LABEL_FAILED:${labeled.code}`);
  const mentions = options.notifyCollaborators ? await collaboratorMentions(config, upstream.repository, token) : "";
  const comment = await github(config, `/repos/${upstream.repository}/issues/${issue}/comments`, "POST", { body: JSON.stringify({ body: `${assessment.message}${mentions}` }), token });
  if (!comment.ok) throw new Error(`ISSUE_COMMENT_FAILED:${comment.code}`);
  return print({ code: "UPSTREAM_ASSESSMENT_PUBLISHED", issue, label, notified: Boolean(mentions) });
}

async function collaboratorMentions(config, repository, token) {
  const result = await github(config, `/repos/${repository}/collaborators?per_page=100`, "GET", { token });
  if (!result.ok || !Array.isArray(result.data)) return "";
  const names = result.data.map((entry) => String(entry.login || "")).filter((name) => /^[A-Za-z0-9-]{1,39}$/u.test(name)).sort();
  return names.length ? `\n\n${names.map((name) => `@${name}`).join(" ")}` : "";
}

async function searchDuplicate(config, repository, title) {
  return github(config, `/search/issues?q=${encodeURIComponent(`repo:${repository} is:issue in:title ${title}`)}`, "GET");
}

async function github(config, pathname, method, options = {}) {
  const apiBase = String(config.githubApi || GITHUB_API).replace(/\/$/u, "");
  return requestJson({
    body: options.body,
    cachePath: method === "GET" ? path.join(CACHE_DIR, `${sha256(pathname).slice(0, 16)}.json`) : "",
    headers: { "User-Agent": "agents-governance", ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) },
    maxBytes: config.maxBytes,
    method,
    retries: config.retries,
    timeoutMs: config.timeoutMs,
    url: `${apiBase}${pathname}`,
  });
}

function resolveIdentity(config) {
  const role = ["consumer", "constructor", "dual"].includes(config.role) ? config.role : "unknown";
  return { executionRepository: path.basename(ROOT_DIR), role };
}

function resolveUpstream(config) {
  const repository = validRepository(config.upstreamRepository) ? config.upstreamRepository : "";
  return { candidate: validRepository(config.candidateRepository) ? config.candidateRepository : "", repository, source: repository ? "configuration" : "unresolved" };
}

function readConfig() {
  const packageConfig = fs.existsSync(path.join(ROOT_DIR, "package.json")) ? JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8"))["agentsUpstream"] || {} : {};
  const localConfig = fs.existsSync(CONFIG_PATH) ? readJson(CONFIG_PATH) : {};
  return { ...packageConfig, ...localConfig };
}

function parseArgs(argv) {
  const result = { positionals: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--authorize") result.authorize = true;
    else if (value === "--dry-run") result.dryRun = true;
    else if (value === "--help") result.help = true;
    else if (value === "--notify-collaborators") result.notifyCollaborators = true;
    else if (value === "--offline") result.offline = true;
    else if (value === "--issue") result.issue = argv[++index];
    else if (value.startsWith("--")) throw new UsageError(`PARAMETRO_DESCONHECIDO:${value}`);
    else result.positionals.push(value);
  }
  return result;
}

function sanitizeProposal(value) {
  if (Array.isArray(value)) return value.map(sanitizeProposal);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key]) => !/(token|secret|password|credential)/iu.test(key)).map(([key, item]) => [key, sanitizeProposal(item)]));
  return typeof value === "string" ? sanitizeText(value).replace(/(?:[A-Z]:)?[\\/][^\s]+/gu, "[PATH_REDACTED]") : value;
}

function validateProposal(proposal, requireUpstream) {
  for (const field of ["title", "context", "gap", "proposal", "reuse", "acceptance"]) required(proposal[field], field);
  if (requireUpstream) required(proposal.upstream && proposal.upstream.repository, "upstreamRepository");
}

function validatePublishable(identity, upstream, proposal) {
  if (identity.role !== "consumer") throw new Error("PUBLISH_REQUIRES_DECLARED_CONSUMER_ROLE");
  if (!upstream.repository) throw new Error("UPSTREAM_UNRESOLVED");
  validateProposal(proposal, false);
}

function issueBody(proposal) {
  const sections = [["Contexto", proposal.context], ["Lacuna", proposal.gap], ["Condições", proposal.conditions], ["Proposta", proposal.proposal], ["Reutilização", proposal.reuse], ["Referência", proposal.reference], ["Impacto", proposal.impact], ["Aceite", proposal.acceptance]];
  return sections.filter(([, value]) => String(value || "").trim()).map(([title, value]) => `## ${title}\n${value}`).join("\n\n");
}

function assessmentMessage(grade, language) {
  const portuguese = !language || /^pt/iu.test(language);
  const messages = portuguese ? {
    rejected: "Agradecimento pela contribuição. A proposta não será aceita porque não apresenta substância técnica reutilizável suficiente.",
    not_recommended: "Agradecimento pelo tempo dedicado. A proposta não é recomendada no estado atual; faltam evidência ou generalização suficientes.",
    recommended: "Recomendação técnica: a proposta possui benefício reutilizável e compatibilidade plausível; requer decisão manual do mantenedor.",
    highly_recommended: "Alta recomendação técnica: a proposta demonstra lacuna reproduzível, benefício amplo e critérios de aceite verificáveis; requer decisão manual do mantenedor.",
  } : {
    rejected: "Thank you for the contribution. It will not be accepted because it lacks sufficient reusable technical substance.",
    not_recommended: "Thank you for the time spent. The proposal is not recommended as submitted; evidence or generalization is insufficient.",
    recommended: "Technical recommendation: reusable benefit and plausible compatibility are present; maintainer decision is required.",
    highly_recommended: "High technical recommendation: reproducible gap, broad benefit, and verifiable acceptance are present; maintainer decision is required.",
  };
  return messages[grade];
}

function projectResponse(response) {
  return { code: response.code, ok: response.ok, status: response.status };
}

function persistRecord(record) {
  const file = path.join(ROOT_DIR, ".ia.rules", "local", "upstream", "records.jsonl");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, `${JSON.stringify(record)}\n`, "utf8");
}

function selfTest() {
  const sanitized = sanitizeProposal({ token: "secret", text: "Bearer abcdefghijklmnop", path: "C:\\private\\client.txt" });
  if (sanitized.token || sanitized.text.includes("abcdefghijklmnop") || !sanitized.path.includes("[PATH_REDACTED]")) throw new Error("UPSTREAM_SANITIZATION_TEST_FAILED");
  if (issueBody({ acceptance: "a", context: "c", gap: "g", proposal: "p", reuse: "r" }).split("##").length !== 6) throw new Error("UPSTREAM_TEMPLATE_TEST_FAILED");
  return print({ code: "UPSTREAM_SELF_TEST_OK" });
}

function readProposal(file) { return readJson(file); }
function readJson(file) { return JSON.parse(fs.readFileSync(path.resolve(ROOT_DIR, file), "utf8")); }
function required(value, name) { if (!String(value || "").trim()) throw new UsageError(`PARAMETRO_NORMATIVO_AUSENTE:${name}`); return value; }
function requiredEnv(name) { return required(process.env[name], name); }
function validRepository(value) { return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(String(value || "")); }
function positiveInt(value, name) { if (!/^\d+$/u.test(String(value)) || Number(value) < 1) throw new UsageError(`PARAMETRO_INVALIDO:${name}`); return Number(value); }
function relative(file) { return path.relative(ROOT_DIR, file).split(path.sep).join("/"); }
function sha256(value) { return crypto.createHash("sha256").update(String(value), "utf8").digest("hex"); }
function print(value) { console.log(JSON.stringify(value)); return 0; }
function help() { return "Uso: upstream-share <check|prepare <evidence.json>|publish <proposal.json> --authorize|assess <proposal.json>|apply-assessment <assessment.json> --issue <n> --authorize> [--offline|--notify-collaborators]\n"; }

class UsageError extends Error { constructor(message) { super(message); this.exitCode = 2; } }

if (require.main === module) main().then((code) => { process.exitCode = code; }).catch((error) => { console.error(error.message); process.exitCode = error.exitCode || 1; });

module.exports = { assessmentMessage, issueBody, main, sanitizeProposal, validateProposal };
