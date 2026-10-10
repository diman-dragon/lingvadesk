import { state } from '../state/appState.js';
import setSetting from './setSetting.js';
import applyPrefs from './applyPrefs.js';
export default async function savePref(key, value) {
  state.prefs[key] = value;
  applyPrefs();
  await setSetting(key, value);
}
