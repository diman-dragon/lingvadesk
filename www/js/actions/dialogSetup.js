import { state } from '../state/appState.js';
import stopDialog from '../dialog/stopDialog.js';
import render from '../nav/render.js';
/** «Сменить роль»: назад к настройке ролей. */
export default async function dialogSetup() {
  await stopDialog();
  state.dialog.phase = 'setup';
  return render();
}
