import { state } from '../state/appState.js';
import { RING } from '../constants/RING.js';
import pageCount from '../pager/pageCount.js';
import setPage from '../pager/setPage.js';
import switchRing from './switchRing.js';
/**
 * Свайп по свободной области (delta: +1 вперёд, −1 назад). Страницы листаются по кругу;
 * на верхнеуровневых экранах за краем последней страницы — следующий экран кольца.
 */
export default function swipeNavigate(delta) {
  const count = pageCount(), ring = RING.includes(state.nav.v), anim = delta > 0 ? 'to-next' : 'to-prev';
  if (count > 1) {
    const next = state.page + delta;
    if (next >= 0 && next < count) return setPage(next, anim);
    return ring ? switchRing(delta) : setPage((next + count) % count, anim);
  }
  return ring ? switchRing(delta) : undefined;
}
