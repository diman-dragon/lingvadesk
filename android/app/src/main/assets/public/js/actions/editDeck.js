import { state } from '../state/appState.js';
import getDeckWithCourse from '../repo/getDeckWithCourse.js';
import go from '../nav/go.js';
export default async function editDeck() {
  const deck = await getDeckWithCourse(state.nav.id);
  return go('deckForm', { id: deck.id, courseId: deck.language_id });
}
