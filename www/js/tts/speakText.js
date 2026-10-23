import ttsSpeak from '../native/ttsSpeak.js';
import speechParams from './speechParams.js';
import toast from '../dom/toast.js';
/** Озвучка: голос слота (0 — основной; 1, 2 — роли диалогов), скорость и высота из настроек. */
export default function speakText(text, lang, slot = 0) {
  return ttsSpeak(text, lang, speechParams(lang, slot)).catch(e => toast(e.message || 'Озвучивание недоступно'));
}
