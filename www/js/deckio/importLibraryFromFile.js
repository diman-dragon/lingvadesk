import safOpen from '../native/safOpen.js';
import fromB64 from '../util/fromB64.js';
import parseImport from './parseImport.js';
import saveLibrary from './saveLibrary.js';
/** Импорт: одна колода (flashcards-deck) или вся библиотека (lingvadesk-library). */
export default async function importLibraryFromFile() {
  const file = await safOpen();
  return saveLibrary(parseImport(fromB64(file.data)));
}
