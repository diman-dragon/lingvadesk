import { state } from '../state/appState.js';
import resolveVoice from './resolveVoice.js';
/** Параметры озвучки для native/ttsSpeak: голос слота (0 — основной), скорость и высота из настроек. */
export default function speechParams(lang, slot = 0) {
  return { voice: resolveVoice(lang, slot), rate: Number(state.prefs.ttsRate), pitch: Number(state.prefs.ttsPitch) };
}
