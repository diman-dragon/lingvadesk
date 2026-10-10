import listCourses from '../repo/listCourses.js';
import header from '../components/header.js';
import button from '../components/button.js';
import entry from '../components/entry.js';
import collection from '../components/collection.js';
import layoutToggle from '../components/layoutToggle.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
export default async function libraryView() {
  const courses = await listCourses();
  const items = courses.map(c => entry({ act: 'goCourse', id: c.id, title: c.name, sub: `колод: ${c.n}`, badge: c.due, avatarText: c.name })).join('');
  const body = items ? collection(items) : emptyState({ icon: '🌍', title: 'Курсов пока нет', text: 'Создайте курс или импортируйте готовую колоду.' });
  return header('Библиотека', { right: layoutToggle() }) + body +
    row(button({ act: 'newCourse', cls: 'p', label: '+ Курс' }) + button({ act: 'importDeck', label: 'Импорт колоды' }));
}
