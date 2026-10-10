import { state } from '../state/appState.js';
import exportDeckToFile from '../deckio/exportDeckToFile.js';
import toast from '../dom/toast.js';
export default async function exportDeck() {
  await exportDeckToFile(state.nav.id);
  toast('Колода экспортирована');
}
