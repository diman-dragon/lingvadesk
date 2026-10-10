import { swipe } from './swipeState.js';
/** true один раз после свайпа: клик, порождённый жестом, нужно проигнорировать. */
export default function consumeSuppress() {
  const v = swipe.suppress;
  swipe.suppress = false;
  return v;
}
