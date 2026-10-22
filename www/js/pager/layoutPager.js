import { state } from '../state/appState.js';
import perPage from './perPage.js';
import pageCount from './pageCount.js';
import measureStarts from './measureStarts.js';
import uniformStarts from './uniformStarts.js';
import fitFaces from '../dom/fitFaces.js';
import pagerDots from '../components/pagerDots.js';
/** Делит элементы на страницы по их настоящей высоте и выводит текущую; anim — класс анимации листания. */
export default function layoutPager(anim = '') {
  const el = document.getElementById('pager');
  if (!el) return;
  const p = state.pager;
  p.starts = p.fixed ? p.items.map((_, i) => i) : measureStarts(el, p) ?? uniformStarts(p.items.length, perPage(el.clientHeight));
  const count = pageCount();
  state.page = state.landing === 'last' ? count - 1 : Math.min(state.page, count - 1);
  state.landing = null;
  const grid = state.prefs.layout === 'grid' && !p.fixed ? ' grid' : '';
  const slice = p.items.slice(p.starts[state.page] ?? 0, p.starts[state.page + 1] ?? p.items.length).join('');
  el.innerHTML = `<div class="page${grid} ${anim}">${slice}</div>`;
  document.getElementById('dots').innerHTML = pagerDots(count);
  fitFaces();
}
