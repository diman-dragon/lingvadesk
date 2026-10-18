import { state } from '../state/appState.js';
import countNewByDeck from '../repo/countNewByDeck.js';
import dayStart from '../util/dayStart.js';
/** Лимиты из настроек + сколько новых уже начато сегодня по каждой колоде (читаем из базы): perDay, used, max. */
export default async function loadLimits() {
  return { perDay: Number(state.prefs.newPerDay), used: await countNewByDeck(dayStart()), max: Number(state.prefs.sessionMax) };
}
