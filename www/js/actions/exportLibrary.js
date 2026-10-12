import exportLibraryToFile from '../deckio/exportLibraryToFile.js';
import toast from '../dom/toast.js';
export default async function exportLibrary() {
  await exportLibraryToFile();
  toast('Библиотека экспортирована');
}
