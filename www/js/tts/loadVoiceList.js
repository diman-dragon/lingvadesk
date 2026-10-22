import { state } from '../state/appState.js';
import ttsVoices from '../native/ttsVoices.js';
/** Голоса устройства (кэш в state.voiceList); force — прочитать заново. Нет моста / движка — пустой список. */
export default async function loadVoiceList(force = false) {
  if (state.voiceList && !force) return state.voiceList;
  try { state.voiceList = (await ttsVoices()).voices ?? []; } catch { state.voiceList = []; }
  return state.voiceList;
}
