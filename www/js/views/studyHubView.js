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
import modeTile from '../components/modeTile.js';
import deckSheet from '../components/deckSheet.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
const sum = (list, f) => list.reduce((a, x) => a + f(x), 0);
/**
 * «Давай-ка поучим…»: режимы (интервальное повторение, карточки, на слух, проверка произношения). Нажатие на режим раскрывает меню
 * колод (state.sheet). План дня — повторить + новые в пределах лимита; когда он выполнен, учёба продолжается без лимита.
 * Все числа читаются из базы.
 */
export default async function studyHubView() {
  const [decks, lim, today, best] = await Promise.all([listDeckStats(), loadLimits(), loadToday(), bestScore()]);
  const top = header('Давай-ка поучим…');
  const total = sum(decks, d => Number(d.total));
  if (!total) {
    return top + emptyState({ icon: '🃏', title: 'Здесь пока нет карточек', text: 'Добавьте карточки в библиотеке.', actions: row(button({ act: 'goLibrary', cls: 'p', label: 'В библиотеку' })) });
  }
  const info = planInfo(decks, lim), left = sum(info, d => d.left), fresh = sum(info, d => d.fresh);
  const stats = row(statCard(sum(info, d => Number(d.due)), 'к повторению') + statCard(fresh, 'новых') + statCard(today.n, 'сегодня') + statCard(today.current, 'дней подряд'), 'stats');
  const plan = left ? `По плану на сегодня: ${left}` : today.n ? '✓ Дневной план выполнен — можно учить дальше' : '✓ На сегодня ничего не запланировано';
  const tiles = MODE_INFO.map(m => modeTile(m, m.mode === 'srs' ? left : m.mode === 'game' ? `🏆 ${best}` : total)).join('');
  return top + stats + `<div class="plan${left ? '' : ' done'}">${plan}</div>${tiles}${state.sheet ? deckSheet(state.sheet, info) : ''}`;
}
