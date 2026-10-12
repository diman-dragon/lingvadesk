import { state } from '../state/appState.js';
import getDeckWithProject from '../repo/getDeckWithProject.js';
import go from '../nav/go.js';
export default async function editDeck() {
  const deck = await getDeckWithProject(state.nav.id);
  return go('deckForm', { id: deck.id, projectId: deck.language_id });
}
