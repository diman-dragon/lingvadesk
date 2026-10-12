import { swipe } from './swipeState.js';
import { SWIPE } from '../constants/SWIPE.js';
import followCard from './followCard.js';
/** Вертикальное движение — это не жест (отмена); горизонтальное сверх допуска — свайп. */
export default function onPointerMove(e) {
  const { el } = swipe;
  if (!el || e.pointerId !== swipe.id) return;
  const dx = e.clientX - swipe.x0, dy = e.clientY - swipe.y0;
  if (!swipe.moved) {
    if (Math.abs(dx) < SWIPE.slop) return;
    if (Math.abs(dy) > Math.abs(dx)) { swipe.el = null; return; }
    swipe.moved = true;
    if (swipe.kind === 'card') { el.setPointerCapture?.(e.pointerId); el.style.transition = 'none'; }
  }
  swipe.dx = dx;
  if (swipe.kind === 'card') followCard(el, dx);
}
