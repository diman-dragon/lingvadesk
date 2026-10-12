import listProjects from '../repo/listProjects.js';
import header from '../components/header.js';
import button from '../components/button.js';
import entry from '../components/entry.js';
import pagedList from '../components/pagedList.js';
import layoutToggle from '../components/layoutToggle.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
/** Верхний уровень библиотеки: проекты + импорт / экспорт всей библиотеки. */
export default async function libraryView() {
  const projects = await listProjects();
  const items = projects.map(c => entry({ act: 'goProject', id: c.id, title: c.name, sub: `колод: ${c.n}`, badge: c.due, avatarText: c.name }));
  const body = items.length ? pagedList(items)
    : emptyState({ icon: '🌍', title: 'Проектов пока нет', text: 'Проект — это язык, тема или что угодно: «Английский», «Даты», «Юр. термины».' });
  const actions = button({ act: 'newProject', cls: 'p', label: '+ Проект' }) + button({ act: 'importLibrary', label: 'Импорт' }) + button({ act: 'exportLibrary', label: 'Экспорт' });
  return header('Библиотека', { right: layoutToggle() }) + body + row(actions, 'foot');
}
