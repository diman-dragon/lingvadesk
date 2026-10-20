import { state } from '../state/appState.js';
import { SWIPE_SCREENS } from '../constants/SWIPE_SCREENS.js';
import { SWIPE } from '../constants/SWIPE.js';
import { swipe } from './swipeState.js';
import cancelHold from './cancelHold.js';
import holdCard from './holdCard.js';
/**
 * Жест начинается на карточке (кроме её кнопок) или на свободной области экрана — в том числе с кнопки:
 * клик после свайпа гасится. Поля ввода и списки выбора жест не начинают.
 */
export default function onPointerDown(e) {
  if (e.button > 0 || e.target.closest('input,textarea,select,.sheet,.sheet-bg')) return;
  const inCard = e.target.closest('.flip');
  const card = inCard && !e.target.closest('button') ? inCard : null;
  const area = !inCard && SWIPE_SCREENS.includes(state.nav.v) && e.target.closest('.view');
  const el = card || area;
  if (!el) return;
  Object.assign(swipe, { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, t0: Date.now(), el, kind: card ? 'card' : 'area', moved: false, suppress: false });
  cancelHold();
  if (card) swipe.hold = setTimeout(holdCard, SWIPE.holdMs);
}
