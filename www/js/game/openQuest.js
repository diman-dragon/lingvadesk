import { state } from '../state/appState.js';
import listCardsInScope from '../repo/listCardsInScope.js';
import newQuest from './newQuest.js';
import go from '../nav/go.js';
/** Запуск квеста по области ('all' | 'd:<id>'): карточки из базы, маршрут, первый этап. */
export default async function openQuest(scope) {
  state.quest = newQuest(await listCardsInScope(scope, 'game'), scope);
  await go('quest');
}
