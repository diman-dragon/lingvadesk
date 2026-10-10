import isIntro from './isIntro.js';
/** Прогресс текущей фазы: для «Обучения» отдельно знакомство и проверка. */
export default function progressOf(s) {
  if (s.mode !== 'learn') return { pos: s.pos, total: s.order.length };
  return isIntro(s) ? { pos: s.pos, total: s.intro } : { pos: s.pos - s.intro, total: s.order.length - s.intro };
}
