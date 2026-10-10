import { swipe } from './swipeState.js';
import springBack from './springBack.js';
export default function onPointerCancel() {
  const { el, moved } = swipe;
  swipe.el = null;
  if (el && moved) springBack(el);
}
