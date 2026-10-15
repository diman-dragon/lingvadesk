import getSetting from '../settings/getSetting.js';
import dayKey from '../util/dayKey.js';
/** { day, n, streak, last }: сколько карточек пройдено сегодня и сколько дней подряд идёт учёба (settings, ключ «today»). */
export default async function loadToday(now = Date.now()) {
  let t = {};
  try { t = JSON.parse(await getSetting('today', '{}')) ?? {}; } catch { t = {}; }
  const day = dayKey(0, now);
  const alive = t.last === day || t.last === dayKey(-1, now);
  return { day, n: t.day === day ? Number(t.n) || 0 : 0, streak: alive ? Number(t.streak) || 0 : 0, last: t.last ?? '' };
}
