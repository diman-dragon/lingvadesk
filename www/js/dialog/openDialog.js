import { state } from '../state/appState.js';
import getDeckWithProject from '../repo/getDeckWithProject.js';
import listCards from '../repo/listCards.js';
import newDialog from './newDialog.js';
import go from '../nav/go.js';
/** Открыть сцену из экрана колод режима «Диалоги» (scope 'd:<id>'): настройка ролей, затем запуск. */
export default async function openDialog(scope) {
  const id = Number(String(scope).replace(/^d:/, ''));
  const [deck, cards] = await Promise.all([getDeckWithProject(id), listCards(id)]);
  state.dialog = newDialog(deck, cards);
  await go('dialog');
}
