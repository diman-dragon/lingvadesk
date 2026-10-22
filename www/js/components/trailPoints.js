import { QUEST } from '../constants/QUEST.js';
/** Точки тропинки: 0 — начало, 1…n — этапы (n — босс). Волна по высоте; координаты в viewBox холста (QUEST.trail). */
export default function trailPoints(n) {
  const { w, pad, mid, amp } = QUEST.trail;
  return Array.from({ length: n + 1 }, (_, k) => [Math.round((pad + k * (w - 2 * pad) / n) * 10) / 10, Math.round((mid + amp * Math.sin(k * 1.3 + 0.5)) * 10) / 10]);
}
