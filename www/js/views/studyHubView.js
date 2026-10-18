import { state } from '../state/appState.js';
import listDeckStats from '../repo/listDeckStats.js';
import loadLimits from '../study/loadLimits.js';
import loadToday from '../study/loadToday.js';
import header from '../components/header.js';
import button from '../components/button.js';
import statCard from '../components/statCard.js';
import allTile from '../components/allTile.js';
import entry from '../components/entry.js';
import pagedList from '../components/pagedList.js';
import prefControl from '../components/prefControl.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
const sum = (list, f) => list.reduce((a, x) => a + f(x), 0);
/**
 * «Давай-ка поучим…»: режим (повторение / на слух) и список колод. Интервальное повторение считается по каждой колоде отдельно —
 * просроченные и новые (в пределах дневного лимита на колоду) показаны у каждой; плитка «Все колоды» соберёт их вместе.
 * Все числа читаются из базы.
 */
export default async function studyHubView() {
  const [decks, lim, today] = await Promise.all([listDeckStats(), loadLimits(), loadToday()]);
  const top = header('Давай-ка поучим…', { right: button({ act: 'goStats', cls: 'sm', label: '📊', aria: 'Статистика' }) });
  if (!sum(decks, d => d.total)) {
    return top + emptyState({ icon: '🃏', title: 'Здесь пока нет карточек', text: 'Добавьте карточки в библиотеке.', actions: row(button({ act: 'goLibrary', cls: 'p', label: 'В библиотеку' })) });
  }
  const listen = state.prefs.mode === 'listen';
  const info = decks.map(d => {
    const fresh = Math.min(d.fresh, Math.max(0, lim.perDay - (lim.used[d.id] ?? 0)));
    return { ...d, fresh, count: listen ? Math.min(d.total, lim.max) : d.due + fresh };
  });
  const due = sum(info, d => d.due), fresh = sum(info, d => d.fresh);
  const stats = row(statCard(due, 'к повторению') + statCard(fresh, 'новых') + statCard(today.n, 'сегодня') + statCard(today.current, 'дней подряд'), 'stats');
  const sub = d => (listen ? `${d.pname} · карточек ${d.total}` : `${d.pname} · повторить ${d.due} · новых ${d.fresh} · выучено ${d.mature}/${d.total}`);
  const items = [allTile(Math.min(sum(info, d => d.count), lim.max), listen ? `${sum(info, d => d.total)} карточек` : `повторить ${due} · новых ${fresh}`)]
    .concat(info.map(d => entry({ act: 'startStudy', id: d.id, title: d.name, sub: sub(d), badge: d.count, avatarText: d.name })));
  return top + stats + `<div class="order"><span>Режим</span>${prefControl('mode')}</div>` + pagedList(items);
}
