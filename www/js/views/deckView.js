import { state } from '../state/appState.js';
import getDeckWithProject from '../repo/getDeckWithProject.js';
import listCards from '../repo/listCards.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import button from '../components/button.js';
import entry from '../components/entry.js';
import pagedList from '../components/pagedList.js';
import layoutToggle from '../components/layoutToggle.js';
import editButton from '../components/editButton.js';
import emptyState from '../components/emptyState.js';
import row from '../components/row.js';
/** Колода: карточки живут только здесь (и в формах), на вкладке «Учёба» их списка нет. */
export default async function deckView() {
  const [deck, cards] = await Promise.all([getDeckWithProject(state.nav.id), listCards(state.nav.id)]);
  const due = cards.filter(c => c.due <= Date.now()).length;
  const items = cards.map(c => entry({ act: 'editCard', id: c.id, title: c.front, sub: c.back }));
  const body = items.length ? pagedList(items) : emptyState({ icon: '🃏', title: 'Карточек нет', text: 'Добавьте первую карточку.' });
  const actions = button({ act: 'newCard', cls: 'p', label: '+ Карточка' }) + button({ act: 'studyHere', label: '🎓 Учить', data: { scope: `d:${deck.id}` } });
  return header(deck.name, { left: backButton('goProject', deck.language_id), right: layoutToggle() + editButton('editDeck') }) +
    `<div class="sub">${deck.pname} · ${cards.length} карточек · ${due} к повторению</div>` + body + row(actions, 'foot');
}
