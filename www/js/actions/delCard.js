import { state } from '../state/appState.js';
import deleteCard from '../repo/deleteCard.js';
import toast from '../dom/toast.js';
import go from '../nav/go.js';
/** 🗑 у карточки в списке колоды (data-id) или «Удалить» в форме карточки. */
export default async function delCard(d) {
  if (!confirm('Удалить карточку?')) return;
  await deleteCard(d?.id ? +d.id : state.nav.id);
  state.session = null;
  toast('Карточка удалена');
  return go('deck', { id: state.nav.deckId ?? state.nav.id });
}
