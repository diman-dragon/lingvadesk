import { state } from '../state/appState.js';
import { PAGER } from '../constants/PAGER.js';
import pageStarts from './pageStarts.js';
/** Выводит все элементы скрыто, меряет их настоящую высоту (текст переносится целиком) и делит на страницы. null — измерить нельзя. */
export default function measureStarts(el, p) {
  if (!el.clientHeight || !el.querySelector) return null;
  const grid = state.prefs.layout === 'grid';
  el.innerHTML = `<div class="page${grid ? ' grid' : ''}" style="visibility:hidden">${p.items.join('')}</div>`;
  const heights = [...el.firstElementChild.children].map(c => c.offsetHeight);
  return pageStarts(heights, el.clientHeight, grid ? PAGER.tileGap : PAGER.gap, grid ? PAGER.cols : 1);
}
