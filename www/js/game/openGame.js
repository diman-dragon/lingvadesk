import { state } from '../state/appState.js';
import { gameTimer } from '../state/gameTimer.js';
import listCardsInScope from '../repo/listCardsInScope.js';
import newGame from './newGame.js';
import nextQuestion from './nextQuestion.js';
import stopGameTimer from './stopGameTimer.js';
import tickGame from './tickGame.js';
import go from '../nav/go.js';
/** Запуск игры по области ('all' | 'd:<id>'): карточки из базы, таймер, первый вопрос. */
export default async function openGame(scope) {
  const game = newGame(await listCardsInScope(scope, 'game'), scope);
  nextQuestion(game);
  state.game = game;
  stopGameTimer();
  await go('game');
  gameTimer.id = setInterval(tickGame, 100);
  gameTimer.id.unref?.();
}
