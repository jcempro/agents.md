const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { requestJson, sanitizeText } = require("./public-client");
const { assessmentMessage } = require("./upstream-share");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const DEFAULT_INBOX_DIR = path.join(ROOT_DIR, ".agents", "local", "upstream", "inbox");
const GITHUB_API = "https://api.github.com";
const ACCEPTED_ACTIONS = new Set(["opened", "edited", "reopened", "labeled"]);

async function main(argv = process.argv.slice(2)) {
  const [command = "", ...rest] = argv;
  const options = parseArgs(rest);
  if (command === "--help" || options.help) return print(help());
  if (command === "event") return print(receiveEvent(readJson(required(options.positionals[0], "event")), options));
  if (command === "fetch") return print(await fetchIssue(required(options.positionals[0], "issue"), options));
  if (command === "evaluate") return print(evaluateRecord(readJson(required(options.positionals[0], "record")), options));
  if (command === "process") return print(await processEvent(readJson(required(options.positionals[0], "event")), options));
  if (command === "apply") return print(await applyAssessment(readJson(required(options.positionals[0], "assessment")), options));
  if (command === "approve") return print(await approveIssue(options));
  if (command === "self-test") return print(selfTest());
  throw new UsageError(`COMANDO_INBOX_INVALIDO:${command || "(vazio)"}`);
}

function receiveEvent(payload, options = {}) {
  const action = String(payload.action || "");
  if (!ACCEPTED_ACTIONS.has(action)) throw new Error(`EVENTO_ISSUE_NAO_AUTORIZADO:${action || "ausente"}`);
  const record = normalizeIssue(payload.repository, payload.issue, action, options);
  return persistRecord(record, options);
}

async function fetchIssue(value, options = {}) {
  assertConstructor(options);
  const number = positiveInt(value, "issue");
  const config = readConfig();
  const repository = required(validRepository(config.upstreamRepository) ? config.upstreamRepository : "", "upstreamRepository");
  const response = await github(config, `/repos/${repository}/issues/${number}`, "GET", { token: process.env.AGENTS_GITHUB_TOKEN || "" });
  if (!response.ok) return { code: "INBOX_FETCH_UNAVAILABLE", issue: number, remote: projectResponse(response) };
  return persistRecord(normalizeIssue({ full_name: repository }, response.data, "manual", options), options);
}

async function processEvent(payload, options = {}) {
  const received = receiveEvent(payload, options);
  const assessment = evaluateRecord(readJson(received.file), options);
  if (!options.authorize) return { code: "INBOX_PROCESSED", received, assessment, published: false };
  return { code: "INBOX_PROCESSED", received, assessment, effect: await applyAssessment(assessment, options), published: !options.dryRun };
}

function normalizeIssue(repositorySource, issueSource, action, options) {
  const repository = required(String(repositorySource && repositorySource.full_name || ""), "repository");
  if (!validRepository(repository)) throw new Error("REPOSITORIO_ISSUE_INVALIDO");
  const number = positiveInt(issueSource && issueSource.number, "issue.number");
  const title = sanitizeIssueText(issueSource && issueSource.title).slice(0, 240);
  const body = sanitizeIssueText(issueSource && issueSource.body).slice(0, 16000);
  const updatedAt = isoDate(issueSource && issueSource.updated_at);
  const evidenceHash = sha256(JSON.stringify({ body, title }));
  const record = {
    schema: 1,
    code: "INBOX_RECEIVED",
    id: `${repository}#${number}`,
    key: `${repository}#${number}@${updatedAt}:${evidenceHash.slice(0, 16)}`,
    evidenceHash,
    status: "received",
    receivedAt: new Date().toISOString(),
    source: { action: String(action || "manual"), repository },
    issue: {
      author: sanitizeLogin(issueSource && issueSource.user && issueSource.user.login),
      body,
      labels: normalizeLabels(issueSource && issueSource.labels),
      language: detectLanguage(`${title}\n${body}`),
      number,
      state: String(issueSource && issueSource.state || "open").toLowerCase() === "open" ? "open" : "closed",
      title,
      updatedAt,
      url: publicIssueUrl(issueSource && issueSource.html_url, repository, number),
    },
  };
  if (!title && !body) record.status = "waiting_evidence";
  return record;
}

function persistRecord(record, options = {}) {
  const inboxDir = resolveInboxDir(options);
  const index = readIndex(inboxDir);
  const existing = index.items.find((item) => item.key === record.key);
  if (existing) return { code: "INBOX_ALREADY_INDEXED", duplicate: true, file: existing.file, key: record.key, status: existing.status };
  const priorEvidence = index.items.find((item) => item.id === record.id && item.evidenceHash === record.evidenceHash);
  const file = path.join(inboxDir, "issues", `${record.issue.number}-${record.evidenceHash.slice(0, 16)}.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(record), "utf8");
  const item = { evidenceHash: record.evidenceHash, file: relative(file), id: record.id, key: record.key, status: record.status, updatedAt: record.issue.updatedAt };
  index.items.push(item);
  index.items.sort((left, right) => left.key.localeCompare(right.key));
  writeJson(path.join(inboxDir, "index.json"), index);
  return { code: "INBOX_INDEXED", duplicate: false, evidenceUnchanged: Boolean(priorEvidence), file: relative(file), key: record.key, status: record.status };
}

function evaluateRecord(record, options = {}) {
  validateRecord(record);
  const text = `${record.issue.title}\n${record.issue.body}`.trim();
  const criteria = {
    compatibility: /compatib|regress|impact/iu.test(text),
    evidence: /teste|test|evid.ncia|reprodu|refer.ncia/iu.test(text),
    generalization: /reutil|general|cen.rio|consumer|consumidor/iu.test(text),
    integrity: Boolean(record.issue.number && record.issue.url && record.issue.author),
    maintenance: /manuten|custo|alternativa|hook/iu.test(text),
    security: !/(api[_ -]?key|secret|password|token\s*[:=])/iu.test(text),
    substance: text.length >= 80,
  };
  const score = Object.values(criteria).filter(Boolean).length;
  const grade = record.status === "waiting_evidence" || score <= 1 ? "rejected" : score <= 3 ? "not_recommended" : score <= 5 ? "recommended" : "highly_recommended";
  const reason = grade === "rejected" ? "faltam dados mínimos para avaliar a proposta" : grade === "not_recommended" ? "faltam evidência técnica ou generalização suficientes" : grade === "recommended" ? "há benefício reutilizável e compatibilidade plausível" : "a lacuna é reproduzível, reutilizável e possui evidências suficientes";
  const language = record.issue.language || "pt-BR";
  const assessment = {
    schema: 1,
    code: "INBOX_ASSESSMENT",
    assessmentHash: sha256(JSON.stringify({ evidenceHash: record.evidenceHash, grade, reason })),
    criteria,
    evidenceHash: record.evidenceHash,
    grade,
    issue: record.issue.number,
    language,
    label: grade === "recommended" ? "agents:recommended" : grade === "highly_recommended" ? "agents:highly-recommended" : "",
    message: `${assessmentMessage(grade, language)} ${localizedReason(reason, language)}`,
    record: recordFile(record, options),
    repository: record.source.repository,
    score,
    status: grade,
  };
  if (options.persist !== false && assessment.record) writeJson(`${absolute(assessment.record)}.assessment.json`, assessment);
  return assessment;
}

async function applyAssessment(assessment, options = {}) {
  assertConstructor(options);
  if (!options.authorize) throw new Error("AUTORIZACAO_EXPLICITA_EXIGIDA");
  validateAssessment(assessment);
  const config = readConfig();
  const repository = required(validRepository(assessment.repository) ? assessment.repository : config.upstreamRepository, "upstreamRepository");
  const issue = positiveInt(options.issue || assessment.issue, "issue");
  const marker = `<!-- agents-inbox:${assessment.assessmentHash.slice(0, 16)} -->`;
  const planned = assessment.grade === "recommended" || assessment.grade === "highly_recommended" ? ["label", "comment"] : ["comment"];
  if (options.dryRun) return { code: "INBOX_EFFECT_DRY_RUN", issue, planned, published: false };
  const token = required(process.env.AGENTS_GITHUB_TOKEN, "AGENTS_GITHUB_TOKEN");
  const comments = await github(config, `/repos/${repository}/issues/${issue}/comments?per_page=100`, "GET", { token });
  if (!comments.ok) return { code: "INBOX_COMMENT_CHECK_UNAVAILABLE", issue, remote: projectResponse(comments) };
  const commented = Array.isArray(comments.data) && comments.data.some((entry) => String(entry.body || "").includes(marker));
  let labeled = false;
  if (assessment.label) {
    const issueData = await github(config, `/repos/${repository}/issues/${issue}`, "GET", { token });
    if (!issueData.ok) return { code: "INBOX_LABEL_CHECK_UNAVAILABLE", issue, remote: projectResponse(issueData) };
    const existingLabels = normalizeLabels(issueData.data.labels);
    if (!existingLabels.includes(assessment.label)) {
      const labelResult = await github(config, `/repos/${repository}/issues/${issue}/labels`, "POST", { body: JSON.stringify({ labels: [assessment.label] }), token });
      if (!labelResult.ok) return { code: "INBOX_LABEL_FAILED", issue, remote: projectResponse(labelResult) };
      labeled = true;
    }
  }
  if (!commented) {
    const mentions = options.notifyCollaborators && config.notifyCollaborators === true ? await collaboratorMentions(config, repository, token) : "";
    const comment = await github(config, `/repos/${repository}/issues/${issue}/comments`, "POST", { body: JSON.stringify({ body: `${assessment.message}\n\n${marker}${mentions}` }), token });
    if (!comment.ok) return { code: "INBOX_COMMENT_FAILED", issue, remote: projectResponse(comment) };
  }
  return { code: "INBOX_EFFECT_APPLIED", commented: !commented, issue, labeled, notified: Boolean(options.notifyCollaborators && config.notifyCollaborators === true) };
}

async function approveIssue(options = {}) {
  assertConstructor(options);
  if (!options.authorize) throw new Error("AUTORIZACAO_EXPLICITA_EXIGIDA");
  const plan = approvalPlan(options.issue);
  if (options.dryRun) return { code: "INBOX_APPROVAL_DRY_RUN", ...plan, published: false };
  const config = readConfig();
  const repository = required(validRepository(config.upstreamRepository) ? config.upstreamRepository : "", "upstreamRepository");
  const token = required(process.env.AGENTS_GITHUB_TOKEN, "AGENTS_GITHUB_TOKEN");
  const issueData = await github(config, `/repos/${repository}/issues/${plan.issue}`, "GET", { token });
  if (!issueData.ok) return { code: "INBOX_APPROVAL_CHECK_UNAVAILABLE", issue: plan.issue, remote: projectResponse(issueData) };
  const comments = await github(config, `/repos/${repository}/issues/${plan.issue}/comments?per_page=100`, "GET", { token });
  if (!comments.ok) return { code: "INBOX_COMMENT_CHECK_UNAVAILABLE", issue: plan.issue, remote: projectResponse(comments) };
  const existingLabels = normalizeLabels(issueData.data.labels);
  const labeled = existingLabels.includes(plan.label);
  const commented = Array.isArray(comments.data) && comments.data.some((entry) => String(entry.body || "").includes(plan.marker));
  if (!labeled) {
    const labelCheck = await github(config, `/repos/${repository}/labels/${encodeURIComponent(plan.label)}`, "GET", { token });
    if (!labelCheck.ok && labelCheck.status === 404) {
      const created = await github(config, `/repos/${repository}/labels`, "POST", { body: JSON.stringify({ color: "1d76db", description: "Aprovada pelo mantenedor para implementação", name: plan.label }), token });
      if (!created.ok && created.status !== 422) return { code: "INBOX_APPROVAL_LABEL_CREATE_FAILED", issue: plan.issue, remote: projectResponse(created) };
    } else if (!labelCheck.ok) return { code: "INBOX_APPROVAL_LABEL_CHECK_FAILED", issue: plan.issue, remote: projectResponse(labelCheck) };
    const labelResult = await github(config, `/repos/${repository}/issues/${plan.issue}/labels`, "POST", { body: JSON.stringify({ labels: [plan.label] }), token });
    if (!labelResult.ok) return { code: "INBOX_APPROVAL_LABEL_FAILED", issue: plan.issue, remote: projectResponse(labelResult) };
  }
  if (!commented) {
    const comment = await github(config, `/repos/${repository}/issues/${plan.issue}/comments`, "POST", { body: JSON.stringify({ body: `${plan.message}\n\n${plan.marker}` }), token });
    if (!comment.ok) return { code: "INBOX_APPROVAL_COMMENT_FAILED", issue: plan.issue, remote: projectResponse(comment) };
  }
  return { code: "INBOX_APPROVED", commented: !commented, issue: plan.issue, labeled: !labeled };
}

function approvalPlan(issueValue) {
  const issue = positiveInt(issueValue, "issue");
  return { issue, label: "agents:approved", marker: `<!-- agents-approved:${issue} -->`, message: "Aprovada para implementação.", planned: ["label", "comment"] };
}

async function collaboratorMentions(config, repository, token) {
  const result = await github(config, `/repos/${repository}/collaborators?per_page=100`, "GET", { token });
  if (!result.ok || !Array.isArray(result.data)) return "";
  const names = result.data.map((entry) => sanitizeLogin(entry.login)).filter(Boolean).sort();
  return names.length ? `\n\n${names.map((name) => `@${name}`).join(" ")}` : "";
}

async function github(config, pathname, method, options = {}) {
  const apiBase = String(config.githubApi || GITHUB_API).replace(/\/$/u, "");
  return requestJson({ body: options.body, cachePath: method === "GET" ? path.join(ROOT_DIR, ".agents", "cache", "inbox", `${sha256(pathname).slice(0, 16)}.json`) : "", headers: { "User-Agent": "agents-governance-inbox", ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) }, maxBytes: config.maxBytes, method, retries: config.retries, timeoutMs: config.timeoutMs, url: `${apiBase}${pathname}` });
}

function readConfig() {
  const packagePath = path.join(ROOT_DIR, "package.json");
  const packageConfig = fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath, "utf8")).agentsUpstream || {} : {};
  const localPath = path.join(ROOT_DIR, ".agents", "upstream.json");
  const localConfig = fs.existsSync(localPath) ? readJson(localPath) : {};
  return { ...packageConfig, ...localConfig };
}

function readIndex(inboxDir) {
  const file = path.join(inboxDir, "index.json");
  if (!fs.existsSync(file)) return { schema: 1, items: [] };
  const index = readJson(file);
  return index && index.schema === 1 && Array.isArray(index.items) ? index : { schema: 1, items: [] };
}

function parseArgs(argv) {
  const result = { positionals: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--authorize") result.authorize = true;
    else if (value === "--dry-run") result.dryRun = true;
    else if (value === "--help") result.help = true;
    else if (value === "--notify-collaborators") result.notifyCollaborators = true;
    else if (value === "--role") result.role = argv[++index];
    else if (value === "--issue") result.issue = argv[++index];
    else if (value.startsWith("--")) throw new UsageError(`PARAMETRO_DESCONHECIDO:${value}`);
    else result.positionals.push(value);
  }
  return result;
}

function sanitizeIssueText(value) {
  return sanitizeText(String(value || "")).replace(/\b(?:api[_-]?key|credential|password|secret|token)\s*[:=]\s*[^\s]+/giu, "[SENSITIVE_REDACTED]").replace(/(?:[A-Z]:)?[\\/][^\s]+/gu, "[PATH_REDACTED]").replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu, "[EMAIL_REDACTED]");
}
function normalizeLabels(labels) { return (Array.isArray(labels) ? labels : []).map((item) => sanitizeText(item && item.name || item)).filter((item) => /^[A-Za-z0-9:_ .-]{1,80}$/u.test(item)).sort(); }
function sanitizeLogin(value) { const login = String(value || ""); return /^[A-Za-z0-9-]{1,39}$/u.test(login) ? login : ""; }
function detectLanguage(value) { return /\b(para|com|não|proposta|evidência|cenário|reutiliz)/iu.test(value) ? "pt-BR" : /\b(the|and|proposal|evidence|scenario|reuse)/iu.test(value) ? "en" : "pt-BR"; }
function localizedReason(reason, language) { return /^pt/iu.test(language) ? `Motivo: ${reason}.` : `Reason: ${reason}.`; }
function publicIssueUrl(value, repository, number) { const expected = `https://github.com/${repository}/issues/${number}`; return String(value || "").startsWith(`https://github.com/${repository}/issues/`) ? String(value) : expected; }
function isoDate(value) { const parsed = new Date(String(value || "")); return Number.isNaN(parsed.getTime()) ? "1970-01-01T00:00:00.000Z" : parsed.toISOString(); }
function recordFile(record, options) { const file = path.join(resolveInboxDir(options), "issues", `${record.issue.number}-${record.evidenceHash.slice(0, 16)}.json`); return fs.existsSync(file) ? relative(file) : ""; }
function resolveInboxDir(options) { return path.resolve(options.inboxDir || process.env.AGENTS_INBOX_DIR || DEFAULT_INBOX_DIR); }
function assertConstructor(options) { const config = readConfig(); const role = options.role || config.role; if (role !== "constructor" && role !== "dual") throw new Error("PAPEL_CONSTRUTOR_EXPLICITO_EXIGIDO"); }
function validateRecord(record) { if (!record || record.schema !== 1 || !record.issue || !validRepository(record.source && record.source.repository)) throw new Error("REGISTRO_INBOX_INVALIDO"); }
function validateAssessment(assessment) { if (!assessment || assessment.schema !== 1 || !["rejected", "not_recommended", "recommended", "highly_recommended"].includes(assessment.grade)) throw new Error("AVALIACAO_INBOX_INVALIDA"); }
function positiveInt(value, name) { if (!/^\d+$/u.test(String(value)) || Number(value) < 1) throw new UsageError(`PARAMETRO_INVALIDO:${name}`); return Number(value); }
function validRepository(value) { return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(String(value || "")); }
function required(value, name) { if (!String(value || "").trim()) throw new UsageError(`PARAMETRO_NORMATIVO_AUSENTE:${name}`); return value; }
function readJson(file) { return JSON.parse(fs.readFileSync(absolute(file), "utf8")); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value), "utf8"); }
function absolute(file) { return path.isAbsolute(file) ? file : path.resolve(ROOT_DIR, file); }
function relative(file) { return path.relative(ROOT_DIR, file).split(path.sep).join("/"); }
function sha256(value) { return crypto.createHash("sha256").update(String(value), "utf8").digest("hex"); }
function projectResponse(response) { return { code: response.code, ok: response.ok, status: response.status }; }
function print(value) { console.log(JSON.stringify(value)); return 0; }
function help() { return "Uso: issue-inbox <event <evento.json>|fetch <numero>|evaluate <registro.json>|process <evento.json>|apply <avaliacao.json>|approve --issue <n>|self-test> [--role constructor|dual] [--authorize] [--dry-run] [--notify-collaborators]\n"; }

function selfTest() {
  const payload = { action: "opened", issue: { body: "## Proposta\nAdicionar hook reutilizável com teste e evidência.", html_url: "https://github.com/owner/repository/issues/7", labels: [{ name: "proposal" }], number: 7, state: "open", title: "Hook reutilizável", updated_at: "2026-07-15T00:00:00Z", user: { login: "contributor" } }, repository: { full_name: "owner/repository" } };
  const record = normalizeIssue(payload.repository, payload.issue, payload.action);
  const assessment = evaluateRecord(record, { persist: false });
  if (!record.key || record.issue.body.includes("token") || !["recommended", "highly_recommended"].includes(assessment.grade)) throw new Error("INBOX_SELF_TEST_FAILED");
  return { code: "INBOX_SELF_TEST_OK" };
}

class UsageError extends Error { constructor(message) { super(message); this.exitCode = 2; } }

if (require.main === module) main().then((code) => { process.exitCode = code; }).catch((error) => { console.error(error.message); process.exitCode = error.exitCode || 1; });

module.exports = { approvalPlan, evaluateRecord, main, normalizeIssue, persistRecord, receiveEvent, sanitizeIssueText };
