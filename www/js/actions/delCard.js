import { state } from '../state/appState.js';
import deleteCard from '../repo/deleteCard.js';
import toast from '../dom/toast.js';
import go from '../nav/go.js';
export default async function delCard() {
  if (!confirm('Удалить карточку?')) return;
  await deleteCard(state.nav.id);
  state.session = null;
  toast('Карточка удалена');
  return go('deck', { id: state.nav.deckId });
}
