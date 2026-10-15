import { track } from '../state/trackState.js';
import trackAdd from './trackAdd.js';
/** Приложение свернули: время на карточке не идёт. */
export default function trackPause() {
  if (!track.live) return;
  trackAdd();
  track.since = 0;
}
