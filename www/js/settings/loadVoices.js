import { state } from '../state/appState.js';
import listSettings from '../repo/listSettings.js';
/** Читает выбранные голоса (ключи voice:<язык>:<слот>) из таблицы settings в state.voices. */
export default async function loadVoices() {
  state.voices = {};
  for (const { key, value } of await listSettings()) if (key.startsWith('voice:') && value) state.voices[key] = value;
}
