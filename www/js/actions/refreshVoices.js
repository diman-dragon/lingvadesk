import loadVoiceList from '../tts/loadVoiceList.js';
import render from '../nav/render.js';
/** «Обновить» список голосов (после установки голосов в настройках Android). */
export default async function refreshVoices() { await loadVoiceList(true); return render(); }
