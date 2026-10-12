import { state } from '../state/appState.js';
import deleteDeck from '../repo/deleteDeck.js';
import toast from '../dom/toast.js';
import go from '../nav/go.js';
export default async function delDeck() {
  if (!confirm('Удалить колоду со всеми карточками?')) return;
  await deleteDeck(state.nav.id);
  state.session = null;
  toast('Колода удалена');
  return go('project', { id: state.nav.projectId });
}
