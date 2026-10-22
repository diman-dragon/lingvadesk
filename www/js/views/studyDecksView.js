import { state } from '../state/appState.js';
import { MODE_INFO } from '../constants/MODE_INFO.js';
import listDeckStats from '../repo/listDeckStats.js';
import loadLimits from '../study/loadLimits.js';
import planInfo from '../study/planInfo.js';
import groupProjects from '../study/groupProjects.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import layoutToggle from '../components/layoutToggle.js';
import deckEntry from '../components/deckEntry.js';
import pagedList from '../components/pagedList.js';
import emptyState from '../components/emptyState.js';
/**
 * Экран режима учёбы (нажатие на режим): колоды сгруппированы по проектам, список или сетка, как на главной «Учёбы».
 * Сверху — проекты (нажатие открывает колоды проекта), внутри — колоды; на каждом элементе
 * всего · изучено · сегодня (цвет, красный «?» при просрочке) и выучено / в процессе / новых. Нажатие на область запускает режим (actions/pickScope).
 */
export default async function studyDecksView() {
  const m = MODE_INFO.find(x => x.mode === state.nav.mode), { project } = state.nav;
  const decks = planInfo(await listDeckStats(), await loadLimits()).filter(d => Number(d.total));
  const group = groupProjects(decks).find(g => g.id === project);
  const head = header(group ? group.name : `${m.icon} ${m.title}`, { left: backButton('back'), right: layoutToggle() });
  if (!decks.length || (project && !group)) return head + emptyState({ icon: '🃏', title: 'Здесь пока нет карточек', text: 'Добавьте карточки в библиотеке.' });
  const items = group
    ? group.decks.map(d => deckEntry(d, 'pickScope', `d:${d.id}`))
    : groupProjects(decks).map(g => deckEntry(g, 'openProjectDecks', g.id, 'project'));
  return head + `<div class="sub">${group ? `${m.icon} ${m.title}` : m.hint}</div>` + pagedList(items);
}
