/**
 * Байты → текст: UTF-8 (с BOM или без), UTF-16 (по BOM); если это не UTF-8 — windows-1251 (так сохраняет русский Excel).
 */
export default function decodeText(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(bytes.subarray(2));
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes.subarray(2));
  try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/, ''); } catch { return new TextDecoder('windows-1251').decode(bytes); }
}
