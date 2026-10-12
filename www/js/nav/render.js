import { appEl } from '../dom/appEl.js';
import { state } from '../state/appState.js';
import { TAB_OF } from '../constants/TAB_OF.js';
import views from '../views/index.js';
import tabBar from '../components/tabBar.js';
import layoutPager from '../pager/layoutPager.js';
/** Экран + нижняя панель (всегда на месте) + постраничный вывод. Анимация проигрывается один раз. */
export default async function render() {
  state.pager = { items: [], titles: [], fixed: false };
  const body = await views[state.nav.v]();
  const form = state.nav.v.endsWith('Form') ? ' form' : '';
  appEl.innerHTML = `<div class="view ${state.anim}${form}">${body}</div>${tabBar(TAB_OF[state.nav.v] ?? '')}`;
  state.anim = '';
  layoutPager();
}
