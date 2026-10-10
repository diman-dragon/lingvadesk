import ttsSpeak from '../native/ttsSpeak.js';
import toast from '../dom/toast.js';
export default function speakText(text, lang) {
  return ttsSpeak(text, lang).catch(e => toast(e.message || 'Озвучивание недоступно'));
}
