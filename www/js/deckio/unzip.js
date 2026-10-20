import inflateRaw from './inflateRaw.js';
const u16 = (b, o) => b[o] | (b[o + 1] << 8);
const u32 = (b, o) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
/** Минимальный чтение zip (xlsx, apkg): центральный каталог → Map имя → байты. Способы сжатия: хранение и deflate. */
export default async function unzip(bytes) {
  let eocd = bytes.length - 22;
  while (eocd >= 0 && u32(bytes, eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('Это не zip-архив');
  const files = new Map();
  let o = u32(bytes, eocd + 16);
  for (let n = u16(bytes, eocd + 10); n > 0 && u32(bytes, o) === 0x02014b50; n--) {
    const method = u16(bytes, o + 10), size = u32(bytes, o + 20), nameLen = u16(bytes, o + 28), extra = u16(bytes, o + 30), comment = u16(bytes, o + 32), local = u32(bytes, o + 42);
    const name = new TextDecoder().decode(bytes.subarray(o + 46, o + 46 + nameLen));
    const start = local + 30 + u16(bytes, local + 26) + u16(bytes, local + 28), raw = bytes.subarray(start, start + size);
    files.set(name, method === 0 ? raw : await inflateRaw(raw));
    o += 46 + nameLen + extra + comment;
  }
  return files;
}
