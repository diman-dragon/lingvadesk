import esc from '../util/esc.js';
import { MODE_INFO } from '../constants/MODE_INFO.js';
import button from './button.js';
import sheetShell from './sheetShell.js';
const item = (mode, scope, title, sub, pill) => button({
  act: 'startStudy', cls: 'sitem', data: { mode, scope },
  label: `<span class="st"><b>${esc(title)}</b><small>${esc(sub)}</small></span><span class="badge">${esc(pill)}</span>`
});
/**
 * Выпадающее меню выбора колоды для режима mode (снизу, прокручивается): «Все колоды» и каждая колода с данными учёбы.
 * info — study/planInfo. Фон и «Отмена» закрывают меню.
 */
export default function deckSheet(mode, info) {
  const m = MODE_INFO.find(x => x.mode === mode), srs = mode === 'srs';
  const rows = info.filter(d => Number(d.total)).map(d => item(mode, `d:${d.id}`, d.name, srs ? `${d.pname} · повторить ${d.due} · новых ${d.fresh}` : `${d.pname} · карточек ${d.total}`, srs ? (d.left || '✓') : d.total));
  const left = info.reduce((a, d) => a + d.left, 0), total = info.reduce((a, d) => a + Number(d.total), 0);
  const all = item(mode, 'all', 'Все колоды', srs ? `повторить ${info.reduce((a, d) => a + Number(d.due), 0)} · новых ${info.reduce((a, d) => a + d.fresh, 0)}` : `карточек ${total}`, srs ? (left || '✓') : total);
  return sheetShell(m.title, all + rows.join(''));
}
