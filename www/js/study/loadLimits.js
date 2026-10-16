import { state } from '../state/appState.js';
import countNewToday from '../repo/countNewToday.js';
import dayStart from '../util/dayStart.js';
/** Лимиты интервального повторения: новых карточек на сегодня осталось и размер сессии (настройки «Лимиты»). */
export default async function loadLimits() {
  const used = await countNewToday(dayStart());
  return { newLeft: Math.max(0, Number(state.prefs.newPerDay) - used), max: Number(state.prefs.sessionMax) };
}
