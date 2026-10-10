import { state } from '../state/appState.js';
import parentOf from './parentOf.js';
import go from './go.js';
/** «Назад»: по истории, а без неё — на родительский экран. */
export default function goBack() {
  if (globalThis.history?.length > 1) { globalThis.history.back(); return Promise.resolve(); }
  const { view, params } = parentOf(state.nav);
  return go(view, params);
}
