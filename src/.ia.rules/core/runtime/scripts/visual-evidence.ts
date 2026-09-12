// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

/** Lê dimensões por cabeçalho sem decodificador externo oculto. */
function imageDimensions(buffer) {
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { format: "png", width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.length >= 10 && ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"))) {
    return { format: "gif", width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }
  if (buffer.subarray(0, 2).toString("ascii") === "P6") return parsePpm(buffer).dimensions;
  throw new Error("IMAGEM_FORMATO_NAO_SUPORTADO");
}

/** Decodifica PPM P6 mínimo para operações de pixel reproduzíveis sem dependência. */
function parsePpm(buffer) {
  const header = buffer.toString("latin1", 0, Math.min(buffer.length, 512));
  const match = header.match(/^P6\s+(?:#[^\r\n]*\s+)*(\d+)\s+(\d+)\s+(255)\s/u);
  if (!match) throw new Error("PPM_INVALIDO");
  const offset = match[0].length;
  const width = Number(match[1]); const height = Number(match[2]);
  const pixels = buffer.subarray(offset);
  if (pixels.length !== width * height * 3) throw new Error("PPM_PIXELS_INVALIDOS");
  return { dimensions: { format: "ppm", width, height }, pixels };
}

/** Codifica pixels RGB em PPM P6. */
function encodePpm(width, height, pixels) {
  if (pixels.length !== width * height * 3) throw new Error("PPM_PIXELS_INVALIDOS");
  return Buffer.concat([Buffer.from(`P6\n${width} ${height}\n255\n`, "ascii"), Buffer.from(pixels)]);
}

/** Recorta região validada de PPM e preserva coordenadas exatas. */
function cropPpm(buffer, region) {
  const { dimensions, pixels } = parsePpm(buffer);
  const { x, y, width, height } = region;
  if (![x, y, width, height].every(Number.isInteger) || x < 0 || y < 0 || width < 1 || height < 1 || x + width > dimensions.width || y + height > dimensions.height) {
    throw new Error("REGIAO_INVALIDA");
  }
  const output = Buffer.alloc(width * height * 3);
  for (let row = 0; row < height; row += 1) {
    pixels.copy(output, row * width * 3, ((y + row) * dimensions.width + x) * 3, ((y + row) * dimensions.width + x + width) * 3);
  }
  return encodePpm(width, height, output);
}

/** Compara duas imagens PPM de mesma geometria e retorna magnitude e bounding box. */
function diffPpm(before, after) {
  const left = parsePpm(before); const right = parsePpm(after);
  if (left.dimensions.width !== right.dimensions.width || left.dimensions.height !== right.dimensions.height) throw new Error("DIFF_DIMENSOES_DIVERGENTES");
  let changedPixels = 0; let totalDelta = 0;
  let minX = left.dimensions.width; let minY = left.dimensions.height; let maxX = -1; let maxY = -1;
  for (let offset = 0; offset < left.pixels.length; offset += 3) {
    const delta = Math.abs(left.pixels[offset] - right.pixels[offset]) + Math.abs(left.pixels[offset + 1] - right.pixels[offset + 1]) + Math.abs(left.pixels[offset + 2] - right.pixels[offset + 2]);
    if (!delta) continue;
    changedPixels += 1; totalDelta += delta;
    const pixel = offset / 3; const x = pixel % left.dimensions.width; const y = Math.floor(pixel / left.dimensions.width);
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  return {
    changedPixels, totalPixels: left.dimensions.width * left.dimensions.height,
    ratio: changedPixels / (left.dimensions.width * left.dimensions.height), meanChannelDelta: totalDelta / Math.max(1, changedPixels * 3),
    region: changedPixels ? { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 } : null,
  };
}

/** Calcula contraste WCAG entre duas cores hexadecimais RGB. */
function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    if (!/^#[0-9a-f]{6}$/iu.test(hex)) throw new Error(`COR_INVALIDA:${hex}`);
    const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
      .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

/** Extrai contagem de páginas e MediaBox declaradas de PDF para triagem mecânica. */
function inspectPdf(buffer) {
  const text = buffer.toString("latin1");
  if (!text.startsWith("%PDF-")) throw new Error("PDF_INVALIDO");
  const pages = [...text.matchAll(/\/Type\s*\/Page(?!s)\b/gu)].length;
  const boxes = [...text.matchAll(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/gu)]
    .map((match) => ({ widthPt: Number(match[3]) - Number(match[1]), heightPt: Number(match[4]) - Number(match[2]) }));
  return { format: "pdf", pages, boxes };
}

/** Audita unidades fixas em CSS e distingue exceções justificadas. */
function auditFluidUnits(css) {
  const findings = [];
  for (const [index, line] of String(css).split(/\r?\n/u).entries()) {
    for (const match of line.matchAll(/(-?\d+(?:\.\d+)?)(px|pt)\b/gu)) {
      if (line.includes("agents-fluid-exception:")) continue;
      findings.push({ line: index + 1, value: match[0], reason: "unidade fixa sem justificativa" });
    }
  }
  return { code: findings.length ? "FLUID_UNITS_REVIEW" : "FLUID_UNITS_OK", findings };
}

/** Valida ledger antes/depois e exige vínculo regional inequívoco. */
function validateLedger(entries) {
  const required = ["artifact", "region", "observation", "rule", "expected", "criterion", "before", "after"];
  for (const [index, entry] of entries.entries()) {
    const missing = required.filter((field) => !entry || entry[field] === undefined || entry[field] === "");
    if (missing.length) throw new Error(`LEDGER_INCOMPLETO:${index}:${missing.join(",")}`);
  }
  return { code: "LEDGER_OK", entries: entries.length };
}

/** Executa capturador/renderizador opcional por contrato explícito e sem shell. */
function runOptionalRenderer(command, args, options = {}) {
  if (!command) throw new Error("RENDERIZADOR_NAO_CONFIGURADO");
  const result = childProcess.spawnSync(command, args || [], { cwd: options.cwd || process.cwd(), encoding: "utf8", shell: false, timeout: options.timeoutMs || 120000, windowsHide: true });
  if (result.error) throw new Error(`RENDERIZADOR_INDISPONIVEL:${result.error.message}`);
  if (result.status !== 0) throw new Error(`RENDERIZADOR_FALHOU:${result.status}:${result.stderr || result.stdout}`);
  return { code: "RENDER_OK", stdout: result.stdout, stderr: result.stderr };
}

/** Inspeciona arquivo suportado preservando bytes do original. */
function inspectAsset(filePath) {
  const buffer = fs.readFileSync(filePath);
  const extension = path.extname(filePath).toLocaleLowerCase("en-US");
  return extension === ".pdf" ? inspectPdf(buffer) : imageDimensions(buffer);
}

/** Executa CLI mecânica de inspeção. */
function main(argv = process.argv.slice(2)) {
  if (argv[0] === "inspect" && argv[1]) { console.log(JSON.stringify(inspectAsset(path.resolve(argv[1])))); return; }
  if (argv[0] === "contrast" && argv[1] && argv[2]) { console.log(JSON.stringify({ ratio: contrastRatio(argv[1], argv[2]) })); return; }
  if (argv[0] === "css" && argv[1]) { console.log(JSON.stringify(auditFluidUnits(fs.readFileSync(path.resolve(argv[1]), "utf8")))); return; }
  throw new Error("Uso: visual-evidence <inspect arquivo|contrast #rrggbb #rrggbb|css arquivo>");
}

if (require.main === module) { try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; } }

module.exports = { auditFluidUnits, contrastRatio, cropPpm, diffPpm, encodePpm, imageDimensions, inspectAsset, inspectPdf, parsePpm, runOptionalRenderer, validateLedger };
