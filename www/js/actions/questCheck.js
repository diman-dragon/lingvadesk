import { state } from '../state/appState.js';
import readField from '../dom/readField.js';
import toast from '../dom/toast.js';
import sameAnswer from '../util/sameAnswer.js';
import submitQuest from '../game/submitQuest.js';
/** «Проверить» (и Enter) на этапе с вводом. */
export default function questCheck() {
  const q = state.quest, s = q?.stages[q.i];
  if (!s || s.kind !== 'type' || q.result) return;
  const typed = readField('ans');
  if (!typed) return toast('Введите ответ');
  return submitQuest(sameAnswer(typed, s.answer), { typed });
}
