import { swipe } from './swipeState.js';
/** Начало жеста на карточке (кнопки внутри карточки жест не начинают). */
export default function onPointerDown(e) {
  const el = e.target.closest?.('.flip');
  if (!el || e.target.closest('button') || e.button > 0) return;
  Object.assign(swipe, { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, el, moved: false, suppress: false });
}
