import { state } from '../state/appState.js';
import { LEARN_BATCH } from '../constants/LEARN_BATCH.js';
import listProjects from '../repo/listProjects.js';
import listAllDecks from '../repo/listAllDecks.js';
import getScopeStats from '../repo/getScopeStats.js';
import validScope from '../study/validScope.js';
import header from '../components/header.js';
import button from '../components/button.js';
import scopeSelect from '../components/scopeSelect.js';
import statCard from '../components/statCard.js';
import modeTile from '../components/modeTile.js';
import prefControl from '../components/prefControl.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
/** Вкладка «Учёба»: область, статистика и три режима — интервальное повторение, обучение, простое повторение. */
export default async function studyHubView() {
  const [projects, decks] = await Promise.all([listProjects(), listAllDecks()]);
  state.scope = validScope(state.scope, projects, decks);
  const s = await getScopeStats(state.scope);
  const top = header('Учёба') + scopeSelect({ projects, decks, value: state.scope });
  if (!s.total) {
    return top + emptyState({ icon: '🃏', title: 'Здесь пока нет карточек', text: 'Добавьте карточки в библиотеке или выберите другую область.', actions: row(button({ act: 'goLibrary', cls: 'p', label: 'В библиотеку' })) });
  }
  const stats = row(statCard(s.due, 'к повторению') + statCard(s.fresh, 'новых') + statCard(s.mature, 'выучено'), 'stats');
  const order = `<div class="order"><span>Порядок повторения</span>${prefControl('shuffle')}</div>`;
  return top + stats + modeTile('srs', s.due) + modeTile('learn', Math.min(s.fresh, LEARN_BATCH)) + modeTile('review', s.total) + order;
}
