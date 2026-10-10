import getStats from '../repo/getStats.js';
import listDueDecks from '../repo/listDueDecks.js';
import header from '../components/header.js';
import button from '../components/button.js';
import navItem from '../components/navItem.js';
import statCard from '../components/statCard.js';
import emptyState from '../components/emptyState.js';
import sectionTitle from '../components/sectionTitle.js';
import logoMark from '../components/logoMark.js';
import row from '../components/row.js';
const toLibrary = button({ act: 'goLibrary', cls: 'p', label: 'Открыть библиотеку' });
export default async function todayView() {
  const [s, decks] = await Promise.all([getStats(), listDueDecks()]);
  const stats = row(statCard(s.due, 'к повторению') + statCard(s.total, 'карточек') + statCard(s.mature, 'выучено'), 'stats');
  let body;
  if (!s.total) body = emptyState({ icon: '📚', title: 'Пока нет карточек', text: 'Импортируйте колоду или создайте свою в библиотеке.', actions: row(button({ act: 'importDeck', cls: 'p', label: 'Импорт колоды' }) + toLibrary) });
  else if (!decks.length) body = emptyState({ icon: '🎉', title: 'На сегодня всё!', text: 'Повторений больше нет. Загляните позже или позанимайтесь в свободном режиме.', actions: toLibrary });
  else body = sectionTitle('Пора повторить') + decks.map(d => navItem({ act: 'studyDeck', id: d.id, title: d.name, sub: d.cname, badge: d.due, avatarText: d.cname })).join('');
  return header('Сегодня', { left: `<span class="brand">${logoMark()}</span>` }) + stats + body;
}
