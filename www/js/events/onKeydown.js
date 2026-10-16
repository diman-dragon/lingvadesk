import actions from '../actions/index.js';
/** Enter в поле с data-enter="<действие>" (ответ в режиме «Ввод»). */
export default function onKeydown(e) {
  if (e.key !== 'Enter') return;
  const act = e.target.closest?.('[data-enter]')?.dataset.enter;
  if (act) return actions[act]();
}
