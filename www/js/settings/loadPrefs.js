import { state } from '../state/appState.js';
import { PREF_OPTIONS } from '../constants/PREF_OPTIONS.js';
import listSettings from '../repo/listSettings.js';
/** Читает сохранённые настройки; неизвестные ключи и значения игнорируются. */
export default async function loadPrefs() {
  for (const { key, value } of await listSettings()) {
    if (PREF_OPTIONS[key]?.some(([v]) => v === value)) state.prefs[key] = value;
  }
}
