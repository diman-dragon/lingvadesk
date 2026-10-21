import { LOAD_STEPS } from '../constants/LOAD_STEPS.js';
/** Нагрузка «на сегодня» → одна из 4 градаций: 0 — всё сделано, 1 — немного, 2 — заметно, 3 — много. */
export default function loadLevel(n) {
  const k = Number(n);
  return k <= 0 ? 0 : k <= LOAD_STEPS[0] ? 1 : k <= LOAD_STEPS[1] ? 2 : 3;
}
