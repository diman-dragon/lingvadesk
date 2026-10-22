import { QUEST } from '../constants/QUEST.js';
/** Ответ на текущий этап (ok — верно ли): очки, жизни, отметка на маршруте. → { ok, ms }. Повторный ответ на тот же этап игнорируется (→ null). */
export default function answerQuest(quest, ok, now = Date.now()) {
  if (quest.result) return null;
  quest.result = ok ? 'ok' : 'bad';
  quest.marks.push(quest.result);
  if (ok) { quest.correct++; quest.score += QUEST.base; } else { quest.wrong++; quest.lives--; }
  return { ok, ms: now - quest.since };
}
