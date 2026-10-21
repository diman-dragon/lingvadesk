import gradeSplit from '../study/gradeSplit.js';
const LINES = [['again', 'Снова'], ['hard', 'Трудно'], ['good', 'Хорошо'], ['easy', 'Легко']];
/** Параметр «Оценки»: как распределились оценки за 30 дней. */
export default function grades(d) {
  const g = gradeSplit(d.rows), total = Math.max(1, d.rows.length);
  const lines = LINES.map(([k, label]) => `<div class="grow"><span>${label}</span><div class="gbar"><i class="${k}" style="width:${Math.round(100 * g[k] / total)}%"></i></div><b>${g[k]}</b></div>`).join('');
  return { icon: '📊', title: 'Оценки', value: d.rows.length, sub: `снова ${g.again} · хорошо ${g.good} · легко ${g.easy}`, detail: `<h4>Оценки за 30 дней</h4>${lines}` };
}
