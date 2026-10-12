import { state } from '../state/appState.js';
import layoutPager from './layoutPager.js';
/** Переход на страницу i; anim — to-next | to-prev. */
export default function setPage(i, anim) {
  state.page = i;
  layoutPager(anim);
}
