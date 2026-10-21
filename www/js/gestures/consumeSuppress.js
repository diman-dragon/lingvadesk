import { swipe } from './swipeState.js';
import { SWIPE } from '../constants/SWIPE.js';
/** true один раз сразу после свайпа: клик, порождённый жестом, нужно проигнорировать. Метка живёт SWIPE.suppressMs — иначе жест, не давший клика, гасил бы следующее нажатие кнопки. */
export default function consumeSuppress() {
  const v = swipe.suppress > 0 && Date.now() - swipe.suppress < SWIPE.suppressMs;
  swipe.suppress = 0;
  return v;
}
