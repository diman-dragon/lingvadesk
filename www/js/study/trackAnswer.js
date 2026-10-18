import { track } from '../state/trackState.js';
import trackAdd from './trackAdd.js';
/** Ответ на вопрос с выбором / вводом: время до ответа = время на вспоминание; дальше идёт чтение ответа. hinted — своя подсказка или показанный текст. */
export default function trackAnswer(correct, hinted) {
  if (!track.live) return;
  trackAdd();
  Object.assign(track, { think: track.front, correct, hinted: hinted || track.hinted, side: 'back' });
}
