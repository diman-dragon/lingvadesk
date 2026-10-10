import { MODES } from '../constants/MODES.js';
import { MODE_META } from '../constants/MODE_META.js';
import esc from '../util/esc.js';
import button from './button.js';
/** Крупная плитка режима обучения; hint — продолжение / число к повторению. */
export default function modeTile(mode, hint) {
  const m = MODE_META[mode];
  const label = `<span class="ti">${m.icon}</span><span><b>${esc(MODES[mode])}</b><small>${esc(m.hint + (hint ? ` · ${hint}` : ''))}</small></span>`;
  return button({ act: 'startStudy', cls: 'tile', label, data: { mode } });
}
