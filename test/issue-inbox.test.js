const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { approvalPlan, evaluateRecord, normalizeIssue, persistRecord, sanitizeIssueText } = require("../.ia.rules/core/runtime/scripts/issue-inbox");

function main() {
  const payload = {
    action: "opened",
    issue: {
      body: "## Proposta\nCriar um hook reutilizável com teste, evidência, compatibilidade, impacto e manutenção. Token: segredo-nao-publico. contato@privado.test C:\\privado\\arquivo.txt",
      html_url: "https://github.com/owner/repository/issues/42",
      labels: [{ name: "proposal" }],
      number: 42,
      state: "open",
      title: "Hook reutilizável para consumidores",
      updated_at: "2026-07-15T00:00:00Z",
      user: { login: "contributor" },
    },
    repository: { full_name: "owner/repository" },
  };
  const record = normalizeIssue(payload.repository, payload.issue, payload.action);
  assert.equal(record.issue.language, "pt-BR");
  assert.match(record.issue.body, /REDACTED/u);
  assert.doesNotMatch(record.issue.body, /segredo-nao-publico/u);
  assert.match(record.issue.body, /EMAIL_REDACTED/u);
  assert.match(record.issue.body, /PATH_REDACTED/u);
  assert.equal(sanitizeIssueText("Bearer segredo-muito-longo"), "Bearer [REDACTED]");
  const assessment = evaluateRecord(record, { persist: false });
  assert.equal(assessment.grade, "highly_recommended");
  assert.match(assessment.message, /Motivo/u);
  const approval = approvalPlan("42");
  assert.deepEqual(approval, {
    issue: 42,
    label: "agents:approved",
    marker: "<!-- agents-approved:42 -->",
    message: "Aprovada para implementação.",
    planned: ["label", "comment"],
  });

  const inbox = fs.mkdtempSync(path.join(os.tmpdir(), "agents-inbox-test-"));
  try {
    const first = persistRecord(record, { inboxDir: inbox });
    const second = persistRecord(record, { inboxDir: inbox });
    assert.equal(first.code, "INBOX_INDEXED");
    assert.equal(second.code, "INBOX_ALREADY_INDEXED");
    const index = JSON.parse(fs.readFileSync(path.join(inbox, "index.json"), "utf8"));
    assert.equal(index.items.length, 1);
  } finally {
    fs.rmSync(inbox, { force: true, recursive: true });
  }
}

main();
