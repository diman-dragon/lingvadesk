import { state } from '../state/appState.js';
import stopDialog from '../dialog/stopDialog.js';
import sayLine from '../dialog/sayLine.js';
import show from '../dialog/show.js';
/** Нажали на реплику (data-i): сцена ставится на паузу и реплика звучит своим голосом ещё раз (на реплике пользователя — основным голосом). */
export default async function dialogSay(d) {
  const dlg = state.dialog, line = dlg.lines[Number(d.i)];
  await stopDialog();
  if (dlg.i !== Number(d.i) && !dlg.waiting) { dlg.i = Number(d.i); await show(); }
  await sayLine(dlg, line);
}
