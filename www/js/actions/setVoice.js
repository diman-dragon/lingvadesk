import { state } from '../state/appState.js';
import setSetting from '../settings/setSetting.js';
import voiceKey from '../tts/voiceKey.js';
/** Выбрали голос в списке (data-lang, data-slot; значение — el.value, '' — по умолчанию). Пробное «▶» после этого звучит выбранным голосом. */
export default async function setVoice(d, el) {
  const key = voiceKey(d.lang, d.slot), name = el.value;
  await setSetting(key, name);
  if (name) state.voices[key] = name; else delete state.voices[key];
}
