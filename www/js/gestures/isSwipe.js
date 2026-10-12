import { SWIPE } from '../constants/SWIPE.js';
/** Жест засчитан: прошли достаточно далеко или это быстрый «флик». ms — длительность жеста. */
export default function isSwipe(dx, ms) {
  const d = Math.abs(dx);
  return d >= SWIPE.distance || (d >= SWIPE.flickDistance && d / Math.max(ms, 1) >= SWIPE.flickSpeed);
}
