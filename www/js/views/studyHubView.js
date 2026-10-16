import { state } from '../state/appState.js';
import { LEARN_BATCH } from '../constants/LEARN_BATCH.js';
import { RANDOM_HINTS } from '../constants/RANDOM_HINTS.js';
import { SCOPE_LABELS } from '../constants/SCOPE_LABELS.js';
import listProjects from '../repo/listProjects.js';
import listAllDecks from '../repo/listAllDecks.js';
import getScopeStats from '../repo/getScopeStats.js';
import validScope from '../study/validScope.js';
import randomCandidates from '../study/randomCandidates.js';
import loadLimits from '../study/loadLimits.js';
import loadToday from '../study/loadToday.js';
import header from '../components/header.js';
import button from '../components/button.js';
import scopeSelect from '../components/scopeSelect.js';
import statCard from '../components/statCard.js';
import modeTile from '../components/modeTile.js';
import prefControl from '../components/prefControl.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
/**
 * «Давай-ка поучим…»: область (вся библиотека / проект / колода) → интервальное повторение по ней (просроченные + новые в пределах
 * дневного лимита, не больше размера сессии), обучение и случайная колода.
 */
export default async function studyHubView() {
  const [projects, decks] = await Promise.all([listProjects(), listAllDecks()]);
  state.scope = validScope(state.scope, projects, decks);
  const [all, here, today, pool, lim] = await Promise.all([getScopeStats('all'), getScopeStats(state.scope), loadToday(), randomCandidates(state.scope), loadLimits()]);
  const top = header('Давай-ка поучим…', { right: button({ act: 'goStats', cls: 'sm', label: '📊', aria: 'Статистика' }) });
  if (!all.total) {
    return top + emptyState({ icon: '🃏', title: 'Здесь пока нет карточек', text: 'Добавьте карточки в библиотеке.', actions: row(button({ act: 'goLibrary', cls: 'p', label: 'В библиотеку' })) });
  }
  const kind = state.scope[0], fresh = Math.min(here.fresh, lim.newLeft);
  const random = { hint: RANDOM_HINTS[kind][pool.length ? 0 : 1], off: !pool.length };
  const count = kind === 'p' ? pool.length : kind === 'd' ? here.total : '–';
  const stats = row(statCard(here.due, 'к повторению') + statCard(fresh, 'новых') + statCard(today.n, 'сегодня') + statCard(today.streak, 'дней подряд'), 'stats');
  const order = `<div class="order"><span>Порядок карточек в случайной колоде</span>${prefControl('shuffle')}</div>`;
  return top + scopeSelect({ projects, decks, value: state.scope }) + stats +
    modeTile('srs', Math.min(here.due + fresh, lim.max), { hint: `${SCOPE_LABELS[kind]} · выучено ${here.mature}` }) +
    modeTile('learn', Math.min(here.fresh, LEARN_BATCH)) + modeTile('review', count, random) + order;
}
