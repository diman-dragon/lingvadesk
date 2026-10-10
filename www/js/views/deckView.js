import { state } from '../state/appState.js';
import { MODES } from '../constants/MODES.js';
import { LEARN_BATCH } from '../constants/LEARN_BATCH.js';
import isNewCard from '../srs/isNewCard.js';
import getDeckWithCourse from '../repo/getDeckWithCourse.js';
import listCards from '../repo/listCards.js';
import listDeckStates from '../repo/listDeckStates.js';
import modeHint from './modeHint.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import button from '../components/button.js';
import chip from '../components/chip.js';
import deckHero from '../components/deckHero.js';
import modeTile from '../components/modeTile.js';
import prefControl from '../components/prefControl.js';
import entry from '../components/entry.js';
import collection from '../components/collection.js';
import layoutToggle from '../components/layoutToggle.js';
import editButton from '../components/editButton.js';
import sectionTitle from '../components/sectionTitle.js';
import row from '../components/row.js';
export default async function deckView() {
  const id = state.nav.id;
  const [deck, cards, states] = await Promise.all([getDeckWithCourse(id), listCards(id), listDeckStates(id)]);
  const fresh = Math.min(LEARN_BATCH, cards.filter(isNewCard).length);
  const ctx = { states, fresh, total: cards.length, due: cards.filter(c => c.due <= Date.now()).length };
  const hero = deckHero({ title: deck.name, sub: deck.cname, chips: chip(`${ctx.total} карточек`) + chip(`${ctx.due} к повторению`) });
  const items = cards.map(c => entry({ act: 'editCard', id: c.id, title: c.front, sub: c.back })).join('');
  return header('', { left: backButton('goCourse', deck.language_id), right: layoutToggle() + editButton('editDeck') }) + hero +
    prefControl('dir') + sectionTitle('Учить') +
    Object.keys(MODES).map(m => modeTile(m, modeHint(m, ctx))).join('') +
    sectionTitle(`Карточки (${ctx.total})`) + collection(items) +
    row(button({ act: 'newCard', cls: 'p', label: '+ Карточка' }) + button({ act: 'exportDeck', label: 'Экспорт' }));
}
