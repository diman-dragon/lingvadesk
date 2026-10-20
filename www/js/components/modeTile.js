import esc from '../util/esc.js';
import button from './button.js';
/** Плитка режима на вкладке «Учёба»; count — число в значке. Нажатие раскрывает выбор колоды (actions/openSheet). */
export default function modeTile({ mode, icon, title, hint }, count) {
  const label = `<span class="ti">${icon}</span><span class="tt"><b>${esc(title)}</b><small>${esc(hint)}</small></span><span class="badge">${esc(count)}</span>`;
  return button({ act: 'openSheet', cls: 'tile', label, data: { mode } });
}
