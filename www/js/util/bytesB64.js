/** Uint8Array → base64 (кусками, чтобы не переполнить стек на больших файлах). */
export default function bytesB64(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
