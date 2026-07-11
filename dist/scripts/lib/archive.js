// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido "AS IS", sem garantias de qualquer tipo.

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ZIP_EPOCH_DOS_DATE = 0x0021;
const ZIP_EPOCH_DOS_TIME = 0x0000;
const CRC_TABLE = createCrcTable();

function createZipFromDirectory(sourceDir, targetZipPath, options = {}) {
  const entries = listZipEntries(sourceDir)
    .map((entry) => ({
      absolutePath: entry.absolutePath,
      isDirectory: entry.isDirectory,
      relativePath: normalizeZipPath(path.relative(sourceDir, entry.absolutePath)) + (entry.isDirectory ? "/" : ""),
    }))
    .filter((entry) => !shouldExcludeZipEntry(entry.relativePath, options.exclude || []))
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath, "en"));

  const chunks = [];
  const centralDirectory = [];
  let offset = 0;

  for (const entry of entries) {
    const content = entry.isDirectory ? Buffer.alloc(0) : fs.readFileSync(entry.absolutePath);
    const compressed = zlib.deflateRawSync(content, { level: 9 });
    const nameBuffer = Buffer.from(entry.relativePath, "utf8");
    const crc = crc32(content);
    const localHeader = createLocalFileHeader(nameBuffer, crc, compressed.length, content.length);

    chunks.push(localHeader, nameBuffer, compressed);
    centralDirectory.push(createCentralDirectoryHeader(
      nameBuffer,
      crc,
      compressed.length,
      content.length,
      offset,
    ));
    offset += localHeader.length + nameBuffer.length + compressed.length;
  }

  const centralStart = offset;

  for (const header of centralDirectory) {
    chunks.push(header.buffer, header.nameBuffer);
    offset += header.buffer.length + header.nameBuffer.length;
  }

  chunks.push(createEndOfCentralDirectory(centralDirectory.length, offset - centralStart, centralStart));

  fs.mkdirSync(path.dirname(targetZipPath), { recursive: true });
  fs.writeFileSync(targetZipPath, Buffer.concat(chunks));
}

function extractZip(zipBuffer, destinationDir) {
  let offset = 0;

  while (offset + 30 <= zipBuffer.length) {
    const signature = zipBuffer.readUInt32LE(offset);

    if (signature !== 0x04034b50) {
      break;
    }

    const flags = zipBuffer.readUInt16LE(offset + 6);
    const method = zipBuffer.readUInt16LE(offset + 8);
    const compressedSize = zipBuffer.readUInt32LE(offset + 18);
    const uncompressedSize = zipBuffer.readUInt32LE(offset + 22);
    const nameLength = zipBuffer.readUInt16LE(offset + 26);
    const extraLength = zipBuffer.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const nameEnd = nameStart + nameLength;
    const dataStart = nameEnd + extraLength;
    const dataEnd = dataStart + compressedSize;

    if (flags & 0x0008) {
      throw new Error("ZIP com data descriptor não é suportado pelo atualizador.");
    }

    if (dataEnd > zipBuffer.length) {
      throw new Error("ZIP inválido ou truncado.");
    }

    const relativePath = safeZipPath(zipBuffer.subarray(nameStart, nameEnd).toString("utf8"));

    if (relativePath) {
      const targetPath = path.join(destinationDir, relativePath);

      if (relativePath.endsWith("/")) {
        fs.mkdirSync(targetPath, { recursive: true });
      } else {
        const content = inflateZipEntry(zipBuffer.subarray(dataStart, dataEnd), method, uncompressedSize);
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, content);
      }
    }

    offset = dataEnd;
  }
}

function inflateZipEntry(buffer, method, expectedSize) {
  if (method === 0) {
    return buffer;
  }

  if (method === 8) {
    const inflated = zlib.inflateRawSync(buffer);

    if (inflated.length !== expectedSize) {
      throw new Error("Entrada ZIP com tamanho descompactado inconsistente.");
    }

    return inflated;
  }

  throw new Error(`Método de compressão ZIP não suportado: ${method}`);
}

function safeZipPath(name) {
  const normalized = normalizeZipPath(name).replace(/^\/+/u, "");

  if (
    !normalized ||
    normalized.startsWith("../") ||
    normalized.includes("/../") ||
    /^[a-z]:/iu.test(normalized)
  ) {
    return "";
  }

  return normalized;
}

function createLocalFileHeader(nameBuffer, crc, compressedSize, uncompressedSize) {
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0x0800, 6);
  header.writeUInt16LE(8, 8);
  header.writeUInt16LE(ZIP_EPOCH_DOS_TIME, 10);
  header.writeUInt16LE(ZIP_EPOCH_DOS_DATE, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(compressedSize, 18);
  header.writeUInt32LE(uncompressedSize, 22);
  header.writeUInt16LE(nameBuffer.length, 26);
  header.writeUInt16LE(0, 28);
  return header;
}

function createCentralDirectoryHeader(nameBuffer, crc, compressedSize, uncompressedSize, localHeaderOffset) {
  const buffer = Buffer.alloc(46);
  buffer.writeUInt32LE(0x02014b50, 0);
  buffer.writeUInt16LE(20, 4);
  buffer.writeUInt16LE(20, 6);
  buffer.writeUInt16LE(0x0800, 8);
  buffer.writeUInt16LE(8, 10);
  buffer.writeUInt16LE(ZIP_EPOCH_DOS_TIME, 12);
  buffer.writeUInt16LE(ZIP_EPOCH_DOS_DATE, 14);
  buffer.writeUInt32LE(crc, 16);
  buffer.writeUInt32LE(compressedSize, 20);
  buffer.writeUInt32LE(uncompressedSize, 24);
  buffer.writeUInt16LE(nameBuffer.length, 28);
  buffer.writeUInt16LE(0, 30);
  buffer.writeUInt16LE(0, 32);
  buffer.writeUInt16LE(0, 34);
  buffer.writeUInt16LE(0, 36);
  buffer.writeUInt32LE(0, 38);
  buffer.writeUInt32LE(localHeaderOffset, 42);
  return { buffer, nameBuffer };
}

function createEndOfCentralDirectory(entryCount, centralDirectorySize, centralDirectoryOffset) {
  const buffer = Buffer.alloc(22);
  buffer.writeUInt32LE(0x06054b50, 0);
  buffer.writeUInt16LE(0, 4);
  buffer.writeUInt16LE(0, 6);
  buffer.writeUInt16LE(entryCount, 8);
  buffer.writeUInt16LE(entryCount, 10);
  buffer.writeUInt32LE(centralDirectorySize, 12);
  buffer.writeUInt32LE(centralDirectoryOffset, 16);
  buffer.writeUInt16LE(0, 20);
  return buffer;
}

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function createCrcTable() {
  const table = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let value = index;

    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }

    table[index] = value >>> 0;
  }

  return table;
}

function shouldExcludeZipEntry(relativePath, excludes) {
  return excludes.some((pattern) => {
    if (typeof pattern === "string") {
      return relativePath === normalizeZipPath(pattern);
    }

    return pattern.test(relativePath);
  });
}

function listZipEntries(dirPath) {
  const entries = [];

  if (!fs.existsSync(dirPath)) {
    return entries;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      entries.push({
        absolutePath: entryPath,
        isDirectory: true,
      });
      entries.push(...listZipEntries(entryPath));
    } else if (entry.isFile()) {
      entries.push({
        absolutePath: entryPath,
        isDirectory: false,
      });
    }
  }

  return entries;
}

function normalizeZipPath(value) {
  return String(value || "").replace(/\\/gu, "/");
}

module.exports = {
  createZipFromDirectory,
  extractZip,
  safeZipPath,
};
