import { state } from '../state/appState.js';
import { QUEST } from '../constants/QUEST.js';
import bestScore from '../repo/bestScore.js';
import insertGame from '../repo/insertGame.js';
/** Конец квеста (маршрут пройден или кончились жизни): победа даёт бонус за оставшиеся жизни; результат и рекорд — в базу. Повторный вызов ничего не делает. */
export default async function finishQuest(now = Date.now()) {
  const q = state.quest;
  if (!q || q.saved) return;
  q.saved = true;
  q.over = true;
  q.won = q.lives > 0;
  if (q.won) q.score += q.lives * QUEST.lifeBonus;
  q.seconds = (now - q.startedAt) / 1000;
  q.record = q.score > 0 && q.score > await bestScore('quest');
  await insertGame(q);
}
