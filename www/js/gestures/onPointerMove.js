import { swipe } from './swipeState.js';
import { SWIPE } from '../constants/SWIPE.js';
/** Карточка следует за пальцем; вертикальный жест — это прокрутка, жест отменяется. */
export default function onPointerMove(e) {
  const { el } = swipe;
  if (!el || e.pointerId !== swipe.id) return;
  const dx = e.clientX - swipe.x0, dy = e.clientY - swipe.y0;
  if (!swipe.moved) {
    if (Math.abs(dx) < SWIPE.slop) return;
    if (Math.abs(dy) > Math.abs(dx)) { swipe.el = null; return; }
    swipe.moved = true;
    el.setPointerCapture?.(e.pointerId);
    el.style.transition = 'none';
  }
  swipe.dx = dx;
  el.style.transform = `translateX(${dx}px) rotate(${dx / 22}deg)`;
  el.style.opacity = String(1 - Math.min(0.5, Math.abs(dx) / 400));
}
