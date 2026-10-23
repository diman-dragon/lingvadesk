import { state } from '../state/appState.js';
import runDialog from '../dialog/runDialog.js';
/** «Начать» (и «Ещё раз» после итога): сцена с первой реплики, роль — как выбрана. */
export default function dialogStart() {
  Object.assign(state.dialog, { phase: 'run', i: 0, results: [], heard: null });
  return runDialog();
}
