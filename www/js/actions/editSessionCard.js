import { state } from '../state/appState.js';
import currentCard from '../study/currentCard.js';
import go from '../nav/go.js';
/** Долгое нажатие на карточку в учёбе: правка без выхода в библиотеку. */
export default function editSessionCard() {
  const card = state.session && currentCard(state.session);
  return card ? go('cardForm', { id: card.id, deckId: card.deck_id }) : undefined;
}
