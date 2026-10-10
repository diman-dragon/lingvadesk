import importDeckFromFile from '../deckio/importDeckFromFile.js';
import toast from '../dom/toast.js';
import go from '../nav/go.js';
export default async function importDeck() {
  const r = await importDeckFromFile();
  toast(`Импортировано карточек: ${r.count}`);
  return go('deck', { id: r.deckId });
}
