import safOpen from '../../www/js/native/safOpen.js';
import readImportFile from '../../www/js/deckio/readImportFile.js';
import saveLibrary from '../../www/js/deckio/saveLibrary.js';
/** Тестовый помощник: файл из bridge.io.picked → библиотека (как «Импорт файла» для нашего JSON). */
export default async function importLibraryFromFile() {
  const r = await readImportFile(await safOpen());
  if (r.kind !== 'library') throw new Error('ожидался файл библиотеки');
  return saveLibrary(r.library);
}
