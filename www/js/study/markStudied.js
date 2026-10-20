import { state } from '../state/appState.js';
import iconLevel from '../native/iconLevel.js';
/** Позанимались — значок снова обычный (один вызов за день: повторные ничего не делают). */
export default function markStudied() {
  if (state.iconLevel === 0) return;
  state.iconLevel = 0;
  try { iconLevel({ level: 0 }).catch(() => {}); } catch { /* нет моста */ }
}
