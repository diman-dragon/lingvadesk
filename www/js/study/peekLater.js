import { track } from '../state/trackState.js';
import { BEHAVIOR } from '../constants/BEHAVIOR.js';
/** Долго думает и не переворачивает — через peek мс показываем пример (подсказка без переворота). */
export default function peekLater() {
  const n = track.n;
  const timer = setTimeout(() => {
    if (track.n !== n || !track.live || track.think !== null) return;
    const el = globalThis.document?.querySelector('.peek');
    if (el) el.hidden = false;
  }, BEHAVIOR.peek);
  timer.unref?.();
}
