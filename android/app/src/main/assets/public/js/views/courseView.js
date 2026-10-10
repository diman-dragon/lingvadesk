import { state } from '../state/appState.js';
import getCourse from '../repo/getCourse.js';
import listDecksOfCourse from '../repo/listDecksOfCourse.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import button from '../components/button.js';
import entry from '../components/entry.js';
import collection from '../components/collection.js';
import layoutToggle from '../components/layoutToggle.js';
import editButton from '../components/editButton.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
export default async function courseView() {
  const [course, decks] = await Promise.all([getCourse(state.nav.id), listDecksOfCourse(state.nav.id)]);
  const items = decks.map(d => entry({ act: 'goDeck', id: d.id, title: d.name, sub: `карточек: ${d.n} · к повторению: ${d.due}`, badge: d.due, avatarText: d.name })).join('');
  const body = items ? collection(items) : emptyState({ icon: '🗂️', title: 'Колод нет', text: 'Создайте колоду или импортируйте файл.' });
  return header(course.name, { left: backButton('goLibrary'), right: layoutToggle() + editButton('editCourse') }) + body +
    row(button({ act: 'newDeck', cls: 'p', label: '+ Колода' }) + button({ act: 'importDeck', label: 'Импорт' }));
}
