import { state } from '../state/appState.js';
import perPage from './perPage.js';
import pageCount from './pageCount.js';
import pagerDots from '../components/pagerDots.js';
/** Измеряет область и выводит текущую страницу; anim — класс анимации листания. */
export default function layoutPager(anim = '') {
  const el = document.getElementById('pager');
  if (!el) return;
  const p = state.pager;
  p.per = perPage(el.clientHeight);
  const count = pageCount();
  state.page = state.landing === 'last' ? count - 1 : Math.min(state.page, count - 1);
  state.landing = null;
  const grid = state.prefs.layout === 'grid' && !p.fixed ? ' grid' : '';
  const slice = p.items.slice(state.page * p.per, (state.page + 1) * p.per).join('');
  el.innerHTML = `<div class="page${grid} ${anim}">${slice}</div>`;
  document.getElementById('dots').innerHTML = pagerDots(count);
}
