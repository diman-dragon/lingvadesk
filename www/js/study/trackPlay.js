import { track } from '../state/trackState.js';
/** Нажали «прослушать» ещё раз — сигнал трудности (BEHAVIOR.plays). */
export default function trackPlay() { track.plays++; }
