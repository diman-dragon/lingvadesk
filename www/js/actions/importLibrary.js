import importLibraryFromFile from '../deckio/importLibraryFromFile.js';
import toast from '../dom/toast.js';
import go from '../nav/go.js';
export default async function importLibrary() {
  const r = await importLibraryFromFile();
  toast(`Импорт: проектов ${r.projects}, колод ${r.decks}, новых карточек ${r.added}`);
  return go('library');
}
