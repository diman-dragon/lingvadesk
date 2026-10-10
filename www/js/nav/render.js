import { appEl } from '../dom/appEl.js';
import { state } from '../state/appState.js';
import { TAB_OF } from '../constants/TAB_OF.js';
import views from '../views/index.js';
import tabBar from '../components/tabBar.js';
/** Экран + (для верхнего уровня) нижнее меню. Анимация проигрывается один раз. */
export default async function render() {
  const tab = TAB_OF[state.nav.v];
  const body = await views[state.nav.v]();
  appEl.innerHTML = `<div class="view ${state.anim}${tab ? ' has-tabs' : ''}">${body}</div>${tab ? tabBar(tab) : ''}`;
  state.anim = '';
}
