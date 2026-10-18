import esc from '../util/esc.js';
import button from './button.js';
/** Крупная плитка «Все колоды» вверху списка: запускает учёбу по всей библиотеке. count — число в значке. */
export default function allTile(count, hint) {
  const label = `<span class="ti">🗂️</span><span class="tt"><b>Все колоды</b><small>${esc(hint)}</small></span><span class="badge">${esc(count)}</span>`;
  return button({ act: 'startStudy', cls: 'tile', label, data: { scope: 'all' } });
}
