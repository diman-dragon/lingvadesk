import setSetting from '../settings/setSetting.js';
import loadToday from './loadToday.js';
/** +1 к карточкам дня; серия растёт, когда сегодня это первая учёба после вчерашней. */
export default async function countToday(now = Date.now()) {
  const t = await loadToday(now);
  const streak = t.last === t.day ? t.streak : t.streak + 1;
  await setSetting('today', JSON.stringify({ day: t.day, n: t.n + 1, last: t.day, streak }));
}
