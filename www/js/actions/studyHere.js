import { state } from '../state/appState.js';
import setSetting from '../settings/setSetting.js';
import go from '../nav/go.js';
/** «Учить»: из проекта или колоды — на вкладку «Учёба» с выбранной областью. */
export default async function studyHere(d) {
  state.scope = d.scope;
  await setSetting('scope', d.scope);
  return go('study');
}
