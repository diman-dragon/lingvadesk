import { state } from '../state/appState.js';
import stopDialog from '../dialog/stopDialog.js';
import runDialog from '../dialog/runDialog.js';
import userDone from '../dialog/userDone.js';
/** › / «Дальше»: пропустить реплику; на реплике пользователя — закончить её (оценка сохраняется, если вы её произнесли). */
export default async function dialogNext() {
  const d = state.dialog;
  if (d.waiting) return userDone();
  await stopDialog();
  d.i++;
  return runDialog();
}
