import { state } from '../state/appState.js';
import getProject from '../repo/getProject.js';
import listDecksOfProject from '../repo/listDecksOfProject.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import button from '../components/button.js';
import entry from '../components/entry.js';
import pagedList from '../components/pagedList.js';
import layoutToggle from '../components/layoutToggle.js';
import itemActions from '../components/itemActions.js';
import studyMark from '../components/studyMark.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
/** Проект: колоды (метка учёбы, ✎ изменить, 🗑 удалить). */
export default async function projectView() {
  const [project, decks] = await Promise.all([getProject(state.nav.id), listDecksOfProject(state.nav.id)]);
  const items = decks.map(d => entry({
    act: 'goDeck', id: d.id, title: d.name, sub: `карточек: ${d.n}`, mark: studyMark({ due: d.due, fresh: d.fresh, total: d.n }),
    acts: itemActions('editDeck', 'delDeck', d.id), avatarText: d.name
  }));
  const body = items.length ? pagedList(items) : emptyState({ icon: '🗂️', title: 'Колод нет', text: 'Колода собирает карточки по теме внутри проекта.' });
  return header(project.name, { left: backButton('goLibrary'), right: layoutToggle() }) + body + row(button({ act: 'newDeck', cls: 'p', label: '+ Колода' }), 'foot');
}
