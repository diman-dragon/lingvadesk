const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export default function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => MAP[c]); }
