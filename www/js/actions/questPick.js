import { state } from '../state/appState.js';
import submitQuest from '../game/submitQuest.js';
/** Вариант ответа в квесте (data-i). */
export default function questPick(d) {
  const q = state.quest, i = Number(d.i), s = q?.stages[q.i];
  return s && submitQuest(s.options[i] === s.answer, { picked: i });
}
