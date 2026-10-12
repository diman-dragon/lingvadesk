import { SWIPE } from '../constants/SWIPE.js';
import swipeNavigate from '../nav/swipeNavigate.js';
/** Влево — вперёд (следующая страница / экран), вправо — назад. */
export default function finishAreaSwipe(dx) {
  if (Math.abs(dx) >= SWIPE.distance) return swipeNavigate(dx < 0 ? 1 : -1);
}
