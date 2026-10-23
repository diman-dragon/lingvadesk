import { state } from '../state/appState.js';
import { DIALOG } from '../constants/DIALOG.js';
import sayLine from './sayLine.js';
import sleep from './sleep.js';
import show from './show.js';
import finishDialog from './finishDialog.js';
/**
 * Ход сцены с текущей реплики: каждая реплика показывается и озвучивается своим голосом (дожидаемся окончания), пауза, следующая.
 * Реплика пользователя (роль you) останавливает цикл — ждём его действия (dialog/userDone). Цикл устаревает, если сменился runId, экран или сцена.
 */
export default async function runDialog() {
  const d = state.dialog, id = ++d.runId, live = () => state.dialog === d && d.runId === id && state.nav.v === 'dialog';
  d.playing = true;
  while (live() && d.i < d.lines.length) {
    const line = d.lines[d.i];
    d.waiting = line.role === d.you;
    d.heard = null;
    await show();
    if (d.waiting) { d.playing = false; return; }
    await sayLine(d, line);
    if (!live()) return;
    await sleep(DIALOG.pauseMs);
    if (!live()) return;
    d.i++;
  }
  if (live()) await finishDialog(d);
}
