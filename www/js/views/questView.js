import { state } from '../state/appState.js';
import { QUEST } from '../constants/QUEST.js';
import esc from '../util/esc.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import big from '../components/big.js';
import faceBox from '../components/faceBox.js';
import trail from '../components/trail.js';
import questResult from './questResult.js';
import questControls from './questControls.js';
const verdict = (q, s) => (q.result === 'ok' ? '<div class="verdict ok">✓ Верно</div>' : `<div class="verdict bad">✗ Неверно</div><div class="muted">Правильно: ${esc(s.answer)}</div>`);
/** «Квест»: тропинка с персонажем (метки ✓ / ✗ на узлах), жизни, вопрос и варианты или ввод; после ответа — верный ответ и «Дальше». */
export default async function questView() {
  const q = state.quest, head = header('Квест', { left: backButton('back') });
  if (q.over) return head + trail(q) + await questResult(q);
  const s = q.stages[q.i], hearts = '❤️'.repeat(q.lives) + '🖤'.repeat(QUEST.lives - q.lives);
  return head + `<div class="ghud"><span>${hearts}</span><b>${q.score}</b><span class="combo">Этап ${q.i + 1} / ${q.stages.length}</span></div>${trail(q)}` +
    faceBox(`<div class="muted">${s.kind === 'choice' ? 'Выберите перевод' : 'Введите перевод'}</div>${big(s.prompt)}${q.result ? verdict(q, s) : ''}`) + questControls(q, s);
}
