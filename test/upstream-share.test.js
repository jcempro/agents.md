const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { requestJson, sanitizeText } = require("../.agents/core/runtime/scripts/public-client");
const { assessmentMessage, issueBody, requireAuthorization, sanitizeProposal } = require("../.agents/core/runtime/scripts/upstream-share");
const { resolveRemoteSource } = require("../.agents/core/runtime/scripts/update-agents");

async function main() {
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => new Response('{"value":1}', { status: 200 });
    const success = await requestJson({ retries: 0, timeoutMs: 100, url: "https://example.test/success" });
    assert.equal(success.ok, true);
    assert.equal(success.data.value, 1);

    global.fetch = async () => new Response("temporario", { status: 503 });
    const server = await requestJson({ retries: 0, timeoutMs: 100, url: "https://example.test/server" });
    assert.equal(server.ok, false);
    assert.equal(server.code, "HTTP_SERVER_FAILURE");

    global.fetch = async () => new Response("invalido", { status: 200 });
    const invalid = await requestJson({ retries: 0, timeoutMs: 100, url: "https://example.test/invalid" });
    assert.equal(invalid.ok, false);
    assert.equal(invalid.code, "RESPONSE_JSON_INVALID");
  } finally {
    global.fetch = originalFetch;
  }
  const proposal = sanitizeProposal({ context: "C:\\privado\\cliente", token: "secret", title: "teste" });
  assert.equal(proposal.token, undefined);
  assert.match(proposal.context, /PATH_REDACTED/u);
  assert.match(sanitizeText("Bearer secret-token"), /REDACTED/u);
  assert.match(issueBody({ acceptance: "a", context: "c", gap: "g", proposal: "p", reuse: "r" }), /## Aceite/u);
  assert.match(assessmentMessage("recommended", "pt-BR"), /Recomendação/u);
  assert.throws(() => requireAuthorization({}), /AUTORIZACAO_EXPLICITA_EXIGIDA/u);
  assert.doesNotThrow(() => requireAuthorization({ authorize: true }));

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agents-upstream-test-"));
  try {
    fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ agentsUpstream: { upstreamRepository: "owner/repository" } }), "utf8");
    const source = await resolveRemoteSource(async (url) => ({ body: Buffer.from(url.endsWith("/main") ? '{"commit":{"sha":"abc"}}' : "{}"), statusCode: url.endsWith("/main") ? 200 : 404 }), root);
    assert.match(source.archiveUrl, /owner\/repository\/zipball\/abc/u);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
