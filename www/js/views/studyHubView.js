import { state } from '../state/appState.js';
import { MODE_INFO } from '../constants/MODE_INFO.js';
import listDeckStats from '../repo/listDeckStats.js';
import loadLimits from '../study/loadLimits.js';
import loadToday from '../study/loadToday.js';
import bestScore from '../repo/bestScore.js';
import planInfo from '../study/planInfo.js';
import header from '../components/header.js';
import button from '../components/button.js';
import statCard from '../components/statCard.js';
import modeEntry from '../components/modeEntry.js';
import pagedList from '../components/pagedList.js';
import layoutToggle from '../components/layoutToggle.js';
import deckSheet from '../components/deckSheet.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
const sum = (list, f) => list.reduce((a, x) => a + f(x), 0);
/**
 * «Давай-ка поучим…»: режимы (интервальное повторение, карточки, на слух, игра, проверка произношения) — списком или сеткой, страницами,
 * как проекты и колоды. Нажатие на режим раскрывает меню колод (state.sheet). План дня — повторить + новые в пределах лимита; когда он выполнен, учёба продолжается без лимита.
 * Все числа читаются из базы.
 */
export default async function studyHubView() {
  const [decks, lim, today, best] = await Promise.all([listDeckStats(), loadLimits(), loadToday(), bestScore()]);
  const top = header('Давай-ка поучим…', { right: layoutToggle() });
  const total = sum(decks, d => Number(d.total));
  if (!total) {
    return top + emptyState({ icon: '🃏', title: 'Здесь пока нет карточек', text: 'Добавьте карточки в библиотеке.', actions: row(button({ act: 'goLibrary', cls: 'p', label: 'В библиотеку' })) });
  }
  const info = planInfo(decks, lim), left = sum(info, d => d.left), fresh = sum(info, d => d.fresh);
  const stats = row(statCard(sum(info, d => Number(d.due)), 'к повторению') + statCard(fresh, 'новых') + statCard(today.n, 'сегодня') + statCard(today.current, 'дней подряд'), 'stats');
  const plan = left ? `По плану на сегодня: ${left}` : today.n ? '✓ Дневной план выполнен — можно учить дальше' : '✓ На сегодня ничего не запланировано';
  const sums = { total, learned: total - sum(decks, d => Number(d.fresh)), left, late: sum(decks, d => Number(d.late)) };
  const modes = pagedList(MODE_INFO.map(m => modeEntry(m, sums, m.mode === 'game' ? `🏆 ${best}` : '')));
  return top + stats + `<div class="plan${left ? '' : ' done'}">${plan}</div>${modes}${state.sheet ? deckSheet(state.sheet, info) : ''}`;
}
