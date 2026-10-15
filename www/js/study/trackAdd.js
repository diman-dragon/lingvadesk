import { track } from '../state/trackState.js';
import { BEHAVIOR } from '../constants/BEHAVIOR.js';
/** Прибавляет активное время к текущей стороне. Слишком долгий отрезок — отвлёкся: карточку не оцениваем. */
export default function trackAdd(now = Date.now()) {
  if (track.since) {
    const ms = now - track.since;
    if (ms > BEHAVIOR.idleCap) track.away = true;
    else track[track.side] += ms;
  }
  track.since = now;
}
