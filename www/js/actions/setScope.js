import { state } from '../state/appState.js';
import setSetting from '../settings/setSetting.js';
import render from '../nav/render.js';
/** Выбор области учёбы (весь проект / колода) в выпадающем списке. */
export default async function setScope(_, el) {
  state.scope = el.value;
  await setSetting('scope', el.value);
  return render();
}
