import { state } from '../state/appState.js';
import deleteDeck from '../repo/deleteDeck.js';
import toast from '../dom/toast.js';
import go from '../nav/go.js';
/** 🗑 у колоды в списке проекта (data-id) или «Удалить» в форме колоды. */
export default async function delDeck(d) {
  if (!confirm('Удалить колоду со всеми карточками?')) return;
  await deleteDeck(d?.id ? +d.id : state.nav.id);
  state.session = null;
  toast('Колода удалена');
  return go('project', { id: state.nav.projectId ?? state.nav.id });
}
