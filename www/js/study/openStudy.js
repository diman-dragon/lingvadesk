import { state } from '../state/appState.js';
import startSession from './startSession.js';
import scopeFor from './scopeFor.js';
import trackShow from './trackShow.js';
import autoSpeak from './autoSpeak.js';
import go from '../nav/go.js';
/** Запуск учёбы. origin — область, выбранная на вкладке «Учёба» (из неё потом берётся другая случайная колода). */
export default async function openStudy(mode) {
  const scope = await scopeFor(mode, state.scope);
  if (!scope) throw new Error('Выберите проект или колоду, в которой есть карточки');
  state.session = await startSession(scope, mode, state.prefs.shuffle, state.scope);
  await go('session');
  trackShow(state.session);
  await autoSpeak('show');
}
