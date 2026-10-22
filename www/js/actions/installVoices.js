import ttsInstall from '../native/ttsInstall.js';
import toast from '../dom/toast.js';
/** «Скачать голоса»: открывает экран скачивания голосов синтезатора; вернувшись в приложение, список обновится сам (events/onVisibility). */
export default async function installVoices() {
  try { await ttsInstall(); toast('Выберите язык и скачайте голос, затем вернитесь в приложение'); }
  catch (e) { toast(e.message || 'Не удалось открыть скачивание голосов'); }
}
