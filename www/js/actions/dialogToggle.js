import { state } from '../state/appState.js';
import stopDialog from '../dialog/stopDialog.js';
import runDialog from '../dialog/runDialog.js';
import render from '../nav/render.js';
/** ⏸ / ▶: пауза или продолжение с текущей реплики (реплика прозвучит заново). */
export default async function dialogToggle() {
  const d = state.dialog;
  if (d.waiting) return;
  if (!d.playing) return runDialog();
  await stopDialog();
  return render();
}
