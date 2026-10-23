import { SAMPLE_DIALOGS } from '../constants/SAMPLE_DIALOGS.js';
import parseLibrary from '../deckio/parseLibrary.js';
import saveLibrary from '../deckio/saveLibrary.js';
import toast from '../dom/toast.js';
import render from '../nav/render.js';
/** «Добавить пример» на экране «Диалоги»: три готовые сцены (английский и немецкий); повторное нажатие дублей не создаёт. */
export default async function addSampleDialog() {
  const s = await saveLibrary(parseLibrary(SAMPLE_DIALOGS));
  toast(s.added ? `Добавлено реплик: ${s.added}` : 'Примеры уже добавлены');
  return render();
}
