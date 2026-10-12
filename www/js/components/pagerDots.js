import { state } from '../state/appState.js';
import esc from '../util/esc.js';
/** Точки страниц (для фиксированных страниц — подписи). Тап — переход на страницу. */
export default function pagerDots(count) {
  if (count <= 1) return '';
  const { titles } = state.pager;
  return Array.from({ length: count }, (_, i) => {
    const on = i === state.page ? ' on' : '';
    return titles[i] ? `<span class="dtab${on}" data-act="gotoPage" data-i="${i}">${esc(titles[i])}</span>`
      : `<span class="dot${on}" data-act="gotoPage" data-i="${i}"></span>`;
  }).join('');
}
