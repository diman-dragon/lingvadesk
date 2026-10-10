import { state } from '../state/appState.js';
import resolveTheme from './resolveTheme.js';
export default function applyPrefs() {
  const d = document.documentElement.dataset, p = state.prefs;
  d.theme = resolveTheme(p.theme);
  d.font = p.font;
  d.anim = p.anim;
}
