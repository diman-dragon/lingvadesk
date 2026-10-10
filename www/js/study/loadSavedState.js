import getDeckState from '../repo/getDeckState.js';
/** → { order, pos, intro } | null. Формат: массив (seq/shuffle) или { order, intro } (learn). */
export default async function loadSavedState(deckId, mode) {
  const row = await getDeckState(deckId, mode);
  if (!row?.order_json) return null;
  try {
    const data = JSON.parse(row.order_json);
    return Array.isArray(data) ? { order: data, pos: row.pos, intro: 0 } : { order: data.order, pos: row.pos, intro: data.intro };
  } catch { return null; }
}
