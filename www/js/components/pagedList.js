import { state } from '../state/appState.js';
/** Регистрирует элементы для постраничного вывода; страницы рисует pager/layoutPager после отрисовки. */
export default function pagedList(items, { fixed = false, titles = [] } = {}) {
  state.pager = { items, fixed, titles };
  return '<div id="pager" class="pager"></div><div id="dots" class="dots"></div>';
}
