import { swipe } from './swipeState.js';
import springBack from './springBack.js';
export default function onPointerCancel() {
  const { el, moved, kind } = swipe;
  swipe.el = null;
  if (el && moved && kind === 'card') springBack(el);
}
