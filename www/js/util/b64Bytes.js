/** base64 → Uint8Array. */
export default function b64Bytes(b64) { return Uint8Array.from(atob(b64), c => c.charCodeAt(0)); }
