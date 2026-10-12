import { state } from '../state/appState.js';
import parentOf from './parentOf.js';
import popBack from './popBack.js';
import go from './go.js';
/** «Назад» в интерфейсе (отмена, сохранить): на шаг назад, а если шагов нет — на родительский экран. */
export default async function goBack() {
  if (await popBack()) return;
  const { view, params } = parentOf(state.nav);
  return go(view, params);
}
