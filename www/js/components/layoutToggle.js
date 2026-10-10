import { state } from '../state/appState.js';
import button from './button.js';
/** Переключатель «список ⇄ сетка»; значок показывает, во что переключит. */
export default function layoutToggle() {
  return button({ act: 'toggleLayout', cls: 'icon', label: state.prefs.layout === 'grid' ? '☰' : '▦' });
}
