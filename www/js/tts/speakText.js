import { state } from '../state/appState.js';
import ttsSpeak from '../native/ttsSpeak.js';
import resolveVoice from './resolveVoice.js';
import toast from '../dom/toast.js';
/** Озвучка: голос слота (0 — основной; другие — для диалогов), скорость и высота из настроек. */
export default function speakText(text, lang, slot = 0) {
  const { ttsRate, ttsPitch } = state.prefs;
  return ttsSpeak(text, lang, { voice: resolveVoice(lang, slot), rate: Number(ttsRate), pitch: Number(ttsPitch) })
    .catch(e => toast(e.message || 'Озвучивание недоступно'));
}
