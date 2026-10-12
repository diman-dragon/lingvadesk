import swipeNavigate from '../nav/swipeNavigate.js';
/** Влево — вперёд (следующая страница / экран), вправо — назад. */
export default function finishAreaSwipe(dx, ok) {
  if (ok) return swipeNavigate(dx < 0 ? 1 : -1);
}
