import { track } from '../state/trackState.js';
import trackAdd from './trackAdd.js';
/** Итог по карточке, которую покидают: { think, look, dwell, flips, revisit, away }. */
export default function trackSignals() {
  trackAdd();
  const { think, front, back, flips, revisit, away } = track;
  return { think, look: back, dwell: front + back, flips, revisit, away };
}
