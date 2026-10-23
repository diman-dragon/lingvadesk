import { state } from '../state/appState.js';
import stopDialog from '../dialog/stopDialog.js';
import runDialog from '../dialog/runDialog.js';
/** ‹ — на реплику назад (она прозвучит заново, дальше сцена идёт сама). */
export default async function dialogPrev() {
  const d = state.dialog;
  await stopDialog();
  d.i = Math.max(0, d.i - 1);
  return runDialog();
}
