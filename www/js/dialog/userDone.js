import { state } from '../state/appState.js';
import insertReview from '../repo/insertReview.js';
import speechGrade from '../srs/speechGrade.js';
import runDialog from './runDialog.js';
/** Реплика пользователя закончена (произнесена или пропущена): оценка в историю (mode 'dialog'), итог сцены, дальше по сценарию. */
export default async function userDone() {
  const d = state.dialog, line = d.lines[d.i];
  if (!d.waiting) return;
  if (d.heard) {
    d.results.push({ id: line.id, score: d.heard.score });
    await insertReview(line.id, speechGrade(d.heard.score), {}, 0, 'dialog');
  }
  d.i++;
  return runDialog();
}
