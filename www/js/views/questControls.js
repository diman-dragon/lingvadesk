import esc from '../util/esc.js';
import button from '../components/button.js';
import optGrid from '../components/optGrid.js';
import row from '../components/row.js';
const mark = (q, s, i) => (!q.result ? '' : s.options[i] === s.answer ? ' ok' : q.picked === i ? ' bad' : '');
/** Под карточкой квеста: варианты (2 × 2) или поле ввода; после ответа — «Дальше» (на последнем этапе — «Итог»). */
export default function questControls(q, s) {
  const last = q.lives <= 0 || q.i + 1 >= q.stages.length;
  if (q.result) return (s.kind === 'choice' ? optGrid(s.options, 'questPick', i => mark(q, s, i)) : '') + row(button({ act: 'questNext', cls: 'p wide', label: last ? 'Итог' : 'Дальше' }), 'nav-row');
  if (s.kind === 'choice') return optGrid(s.options, 'questPick') + row(button({ act: 'questGiveUp', cls: 'sm', label: 'Не знаю' }), 'nav-row');
  return `<input id="ans" class="ans" data-enter="questCheck" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ваш ответ" value="${esc(q.typed)}">` +
    row(button({ act: 'questGiveUp', cls: 'sm', label: 'Не знаю' }) + button({ act: 'questCheck', cls: 'p wide', label: 'Проверить' }), 'nav-row');
}
