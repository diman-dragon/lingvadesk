/** Raw deflate (как внутри zip) → байты. Встроенный DecompressionStream: есть в WebView и в Node. */
export default async function inflateRaw(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
