import { state } from '../state/appState.js';
/** Лёгкая вибрация (настройка «Вибрация»); pattern — мс или массив мс. */
export default function buzz(pattern = 12) {
  if (state.prefs.haptic === 'on') globalThis.navigator?.vibrate?.(pattern);
}
