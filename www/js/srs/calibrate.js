import { BEHAVIOR } from '../constants/BEHAVIOR.js';
import median from '../util/median.js';
const clamp = (v, [lo, hi]) => Math.min(hi, Math.max(lo, v));
/**
 * Пороги под человека: rows — последние повторения с переворотом [{ think, look }] (мс).
 * Медленный читатель получает более длинные пороги, быстрый — более короткие. Мало данных — общие пороги.
 */
export default function calibrate(rows) {
  const c = BEHAVIOR.calib;
  if (rows.length < c.min) return BEHAVIOR;
  const kT = clamp(median(rows.map(r => Number(r.think))) / c.ref.think, c.clamp);
  const kL = clamp(median(rows.map(r => Number(r.look))) / c.ref.look, c.clamp);
  return {
    ...BEHAVIOR, think: BEHAVIOR.think.map(v => v * kT), look: BEHAVIOR.look.map(v => v * kL),
    easyThink: BEHAVIOR.easyThink * kT, easyLook: BEHAVIOR.easyLook * kL, readAnswer: BEHAVIOR.readAnswer * kL, known: BEHAVIOR.known * kT
  };
}
