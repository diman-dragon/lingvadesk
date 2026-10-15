import { MODES } from '../constants/MODES.js';
import { MODE_META } from '../constants/MODE_META.js';
import esc from '../util/esc.js';
import button from './button.js';
/** Плитка режима: count — число в значке; hint — подпись вместо стандартной; off — режим сейчас недоступен (нажатие объяснит почему). */
export default function modeTile(mode, count, { hint = MODE_META[mode].hint, off = false } = {}) {
  const m = MODE_META[mode];
  const label = `<span class="ti">${m.icon}</span><span class="tt"><b>${esc(MODES[mode])}</b><small>${esc(hint)}</small></span><span class="badge">${esc(count)}</span>`;
  return button({ act: 'startStudy', cls: off ? 'tile off' : 'tile', label, data: { mode } });
}
