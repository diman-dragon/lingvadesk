import getDeckWithProject from '../repo/getDeckWithProject.js';
import go from '../nav/go.js';
/** ✎ у колоды в списке (data-id). */
export default async function editDeck(d) {
  const deck = await getDeckWithProject(+d.id);
  return go('deckForm', { id: deck.id, projectId: deck.language_id });
}
