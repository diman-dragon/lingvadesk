import { appEl } from '../dom/appEl.js';
import dispatch from './dispatch.js';
import onResize from './onResize.js';
import systemBack from '../nav/systemBack.js';
import onPointerDown from '../gestures/onPointerDown.js';
import onPointerMove from '../gestures/onPointerMove.js';
import onPointerUp from '../gestures/onPointerUp.js';
import onPointerCancel from '../gestures/onPointerCancel.js';
export default function bindEvents() {
  ['click', 'change'].forEach(t => appEl.addEventListener(t, dispatch));
  appEl.addEventListener('pointerdown', onPointerDown);
  appEl.addEventListener('pointermove', onPointerMove);
  appEl.addEventListener('pointerup', onPointerUp);
  appEl.addEventListener('pointercancel', onPointerCancel);
  globalThis.addEventListener?.('lingvaBack', systemBack);   // шлёт MainActivity.onBackPressed
  globalThis.addEventListener?.('resize', onResize);
}
