import { track } from '../state/trackState.js';
import trackAdd from './trackAdd.js';
/** Переворот: закрываем отрезок времени на прежней стороне; первый переворот фиксирует время на вспоминание. */
export default function trackFlip() {
  if (!track.live) return;
  trackAdd();
  if (track.think === null) track.think = track.front;
  track.flips++;
  track.side = track.side === 'front' ? 'back' : 'front';
}
