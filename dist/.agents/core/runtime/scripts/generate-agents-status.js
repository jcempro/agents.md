// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido "AS IS", sem garantias de qualquer tipo.

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const CANONICAL_FILES = [
  path.join(".agents", "continue.ia"),
];
const STATUS_FILE = "handoff.md";

function main(argv = process.argv.slice(2)) {
  if (argv.includes("--help")) {
    console.log("Uso: generate-agents-status [--help]");
    return;
  }
  if (argv.length) {
    throw new Error(`PARAMETRO_INVALIDO:${argv[0]}`);
  }
  const canonical = resolveCanonicalContinueFile(ROOT_DIR);
  const content = fs.readFileSync(canonical.path, "utf8");
  const fronts = parseWorkFronts(content).filter((front) => isTechnicalScope(front.scope));
  const markdown = renderImplementationsStatus(toPosixPath(path.relative(ROOT_DIR, canonical.path)), fronts);
  fs.writeFileSync(path.join(ROOT_DIR, STATUS_FILE), markdown, "utf8");
  console.log(`Resumo operacional atualizado: ${STATUS_FILE}`);
}

function resolveCanonicalContinueFile(rootDir) {
  const found = CANONICAL_FILES
    .map((name) => ({ name, path: path.join(rootDir, name) }))
    .filter((entry) => fs.existsSync(entry.path) && fs.statSync(entry.path).isFile());

  if (found.length !== 1) {
    throw new Error("Deve existir exatamente um arquivo canonico: .agents/continue.ia.");
  }

  return found[0];
}

function parseWorkFronts(content) {
  const fronts = [];
  let currentFront = null;
  let currentStage = null;

  for (const rawLine of String(content || "").split(/\r?\n/u)) {
    const line = rawLine.trimEnd();

    if (/^FT-\d+\|/u.test(line)) {
      currentFront = parseFrontLine(line);
      currentStage = null;
      fronts.push(currentFront);
      continue;
    }

    if (!currentFront) {
      continue;
    }

    const metadata = line.match(/^([a-z_]+)=(.*)$/iu);
    if (metadata && metadata[1] === "objetivo" && !currentFront.objective) {
      currentFront.objective = metadata[2].trim();
      continue;
    }

    const stage = line.match(/^(\d+)\/(\d+)\s+(.+?)\s+\[([^\]]+)\]$/u);
    if (stage) {
      currentStage = {
        name: stage[3].trim(),
        status: normalizeStatus(stage[4]),
        tasks: [],
      };
      currentFront.stages.push(currentStage);
      continue;
    }

    const task = line.match(/^\s+(\d+)\/(\d+)\s+(.+?)\s+\[([^\]]+)\]$/u);
    if (task && currentStage) {
      currentStage.tasks.push({
        name: task[3].trim(),
        status: normalizeStatus(task[4]),
      });
    }
  }

  return fronts;
}

function parseFrontLine(line) {
  const [id, ...fields] = line.split("|");
  const front = {
    id,
    name: "",
    objective: "",
    scope: "",
    stages: [],
    status: "pendente",
  };

  for (const field of fields) {
    const index = field.indexOf("=");

    if (index === -1) {
      continue;
    }

    const key = field.slice(0, index).trim();
    const value = field.slice(index + 1).trim();

    if (key === "nome") {
      front.name = value;
    } else if (key === "objetivo") {
      front.objective = value;
    } else if (key === "escopo") {
      front.scope = value;
    } else if (key === "status") {
      front.status = normalizeStatus(value);
    }
  }

  return front;
}

function renderImplementationsStatus(sourceName, fronts) {
  const lines = [
    "<!-- Gerado por npm run agent:handoff. Nao editar manualmente. -->",
    "# Implementacoes em andamento",
    "",
    `Resumo operacional gerado de \`${sourceName}\`.`,
    "",
  ];

  const activeFronts = fronts.filter((front) => front.status !== "concluído");

  if (activeFronts.length === 0) {
    lines.push("Nenhuma FT tecnica em andamento.", "");
    return lines.join("\n");
  }

  for (const front of activeFronts) {
    lines.push(`## ${front.id} - ${front.name || "Sem nome"}`);
    lines.push("");
    lines.push(`Objetivo: ${formatSentence(front.objective || "registrado em continue.ia")}`);
    lines.push("");
    lines.push("<table>");
    lines.push("<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>");
    lines.push("<tbody>");

    for (const stage of front.stages) {
      const tasks = stage.tasks.length ? stage.tasks : [{ name: "-", status: stage.status }];

      tasks.forEach((task, index) => {
        lines.push("<tr>");

        if (index === 0) {
          lines.push(`<td rowspan="${tasks.length}">${escapeHtml(stage.name)}</td>`);
        }

        lines.push(`<td>${escapeHtml(task.name)}</td>`);
        lines.push(`<td>${renderStatus(task.status)}</td>`);
        lines.push("</tr>");
      });
    }

    lines.push("</tbody>");
    lines.push("</table>");
    lines.push("");
  }

  return lines.join("\n");
}

function renderStatus(status) {
  const normalized = normalizeStatus(status);
  const color = normalized === "concluído"
    ? "#15803d"
    : normalized === "em andamento"
      ? "#ca8a04"
      : "#64748b";
  return `<span style="color:${color}">&#9679;</span> ${escapeHtml(normalized)}`;
}

function formatSentence(value) {
  const text = String(value || "").trim();
  return /[.!?]$/u.test(text) ? text : `${text}.`;
}

function normalizeStatus(status) {
  const value = String(status || "pendente").trim().replace(/_/gu, " ");

  if (/^conclu[ií]do$/iu.test(value)) {
    return "concluído";
  }

  if (/^em andamento$/iu.test(value)) {
    return "em andamento";
  }

  return "pendente";
}

function isTechnicalScope(scope) {
  const value = String(scope || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLocaleLowerCase("pt-BR");
  return value === "tecnico";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;");
}

function toPosixPath(value) {
  return String(value || "").split(path.sep).join("/");
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(`Falha ao atualizar governanca operacional: ${err.message}`);
    process.exitCode = String(err.message).includes("PARAMETRO_INVALIDO:") ? 2 : 1;
  }
}

module.exports = {
  parseWorkFronts,
  renderImplementationsStatus,
  resolveCanonicalContinueFile,
};
