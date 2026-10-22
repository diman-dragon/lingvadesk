import prepareSpeech from '../study/prepareSpeech.js';
import toast from '../dom/toast.js';
import render from '../nav/render.js';
/** «Проверить / скачать» пакет распознавания речи для языка (data-lang): проверка, при необходимости — скачивание; итог в сообщении и в статусе. */
export default async function checkSpeechLang(d) {
  toast(await prepareSpeech(d.lang, true) || `${d.lang}: проверить нельзя на этой версии Android`);
  return render();
}
