import { state } from '../state/appState.js';
import { LEARN_BATCH } from '../constants/LEARN_BATCH.js';
import { RANDOM_HINTS } from '../constants/RANDOM_HINTS.js';
import listProjects from '../repo/listProjects.js';
import listAllDecks from '../repo/listAllDecks.js';
import getScopeStats from '../repo/getScopeStats.js';
import validScope from '../study/validScope.js';
import randomCandidates from '../study/randomCandidates.js';
import loadToday from '../study/loadToday.js';
import header from '../components/header.js';
import button from '../components/button.js';
import scopeSelect from '../components/scopeSelect.js';
import statCard from '../components/statCard.js';
import modeTile from '../components/modeTile.js';
import prefControl from '../components/prefControl.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
/** «Давай-ка поучим…»: интервальное повторение — по всем колодам; обучение и случайная колода — из выбранного проекта или колоды. */
export default async function studyHubView() {
  const [projects, decks] = await Promise.all([listProjects(), listAllDecks()]);
  state.scope = validScope(state.scope, projects, decks);
  const [all, here, today, pool] = await Promise.all([getScopeStats('all'), getScopeStats(state.scope), loadToday(), randomCandidates(state.scope)]);
  const top = header('Давай-ка поучим…');
  if (!all.total) {
    return top + emptyState({ icon: '🃏', title: 'Здесь пока нет карточек', text: 'Добавьте карточки в библиотеке.', actions: row(button({ act: 'goLibrary', cls: 'p', label: 'В библиотеку' })) });
  }
  const kind = state.scope[0];
  const random = { hint: RANDOM_HINTS[kind][pool.length ? 0 : 1], off: !pool.length };
  const count = kind === 'p' ? pool.length : kind === 'd' ? here.total : '–';
  const stats = row(statCard(all.due, 'к повторению') + statCard(today.n, 'сегодня') + statCard(today.streak, 'дней подряд'), 'stats');
  const order = `<div class="order"><span>Порядок карточек</span>${prefControl('shuffle')}</div>`;
  return top + stats + modeTile('srs', all.due, { hint: `Все колоды · выучено ${all.mature}` }) + scopeSelect({ projects, decks, value: state.scope }) +
    modeTile('learn', Math.min(here.fresh, LEARN_BATCH)) + modeTile('review', count, random) + order;
}
