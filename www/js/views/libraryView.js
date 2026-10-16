import listProjects from '../repo/listProjects.js';
import header from '../components/header.js';
import button from '../components/button.js';
import entry from '../components/entry.js';
import pagedList from '../components/pagedList.js';
import layoutToggle from '../components/layoutToggle.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
/** Верхний уровень библиотеки: проекты. Импорт и экспорт всей библиотеки — в настройках («Данные»). */
export default async function libraryView() {
  const projects = await listProjects();
  const items = projects.map(c => entry({ act: 'goProject', id: c.id, title: c.name, sub: `колод: ${c.n}`, badge: c.due, avatarText: c.name }));
  const body = items.length ? pagedList(items)
    : emptyState({ icon: '🌍', title: 'Проектов пока нет', text: 'Проект — это язык, тема или что угодно: «Английский», «Даты», «Юр. термины». Готовую библиотеку можно импортировать в настройках (⚙️ → Данные).' });
  return header('Библиотека', { right: layoutToggle() }) + body + row(button({ act: 'newProject', cls: 'p', label: '+ Проект' }), 'foot');
}
