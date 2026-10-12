import { state } from '../state/appState.js';
import startSession from './startSession.js';
import autoSpeak from './autoSpeak.js';
import go from '../nav/go.js';
/** Запуск учёбы по выбранной области и режиму. */
export default async function openStudy(mode) {
  state.session = await startSession(state.scope, mode, state.prefs.shuffle);
  await go('session');
  await autoSpeak('show');
}
