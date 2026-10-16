import { state } from '../state/appState.js';
import { track } from '../state/trackState.js';
import trackAdd from './trackAdd.js';
/** Итог по карточке, которую покидают: { think, look, dwell, flips, revisit, away, kind, correct, hinted } (kind — вид вопроса, null — переворот). */
export default function trackSignals() {
  trackAdd();
  const { think, front, back, flips, revisit, away, correct, hinted } = track;
  return { think, look: back, dwell: front + back, flips, revisit, away, correct, hinted, kind: state.quiz?.kind ?? null };
}
