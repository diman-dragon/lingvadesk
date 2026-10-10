import { state } from '../state/appState.js';
import getDeckWithCourse from '../repo/getDeckWithCourse.js';
import startSession from './startSession.js';
import autoSpeak from './autoSpeak.js';
import go from '../nav/go.js';
export default async function openStudy(deckId, mode) {
  const deck = await getDeckWithCourse(deckId);
  state.session = await startSession(deck, mode);
  await go('study', { id: deck.id });
  await autoSpeak('show');
}
