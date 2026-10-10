import { state } from '../state/appState.js';
import { PREF_OPTIONS } from '../constants/PREF_OPTIONS.js';
import segmented from './segmented.js';
export default function prefControl(key) { return segmented(key, PREF_OPTIONS[key], state.prefs[key]); }
