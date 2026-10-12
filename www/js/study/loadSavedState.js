import getSetting from '../settings/getSetting.js';
/** → { order, pos, phase, total } | null */
export default async function loadSavedState(key) {
  const raw = await getSetting(key);
  if (!raw) return null;
  try { const s = JSON.parse(raw); return Array.isArray(s.order) ? s : null; } catch { return null; }
}
