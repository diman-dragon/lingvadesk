import { state } from '../state/appState.js';
import ttsStop from '../native/ttsStop.js';
/** Остановить ход сцены (пауза, переход, выход): текущий цикл воспроизведения устаревает, озвучка обрывается. */
export default async function stopDialog() {
  const d = state.dialog;
  if (!d) return;
  d.runId++;
  d.playing = false;
  await ttsStop().catch(() => {});
}
