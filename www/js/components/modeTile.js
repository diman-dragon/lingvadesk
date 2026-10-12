import { MODES } from '../constants/MODES.js';
import { MODE_META } from '../constants/MODE_META.js';
import esc from '../util/esc.js';
import button from './button.js';
/** Плитка режима учёбы; count — сколько карточек доступно в выбранной области. */
export default function modeTile(mode, count) {
  const m = MODE_META[mode];
  const label = `<span class="ti">${m.icon}</span><span class="tt"><b>${esc(MODES[mode])}</b><small>${esc(m.hint)}</small></span><span class="badge">${count}</span>`;
  return button({ act: 'startStudy', cls: 'tile', label, data: { mode } });
}
