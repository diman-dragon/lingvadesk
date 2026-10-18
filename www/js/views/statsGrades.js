import statCard from '../components/statCard.js';
import row from '../components/row.js';
import gradeSplit from '../study/gradeSplit.js';
import medianTimes from '../study/medianTimes.js';
const LINES = [['again', 'Снова', 'again'], ['hard', 'Трудно', 'hard'], ['good', 'Хорошо', 'good'], ['easy', 'Легко', 'easy']];
/** Страница «Оценки»: как распределились оценки за 30 дней, режимы, подсказки и медианное время. */
export default function statsGrades(d) {
  const g = gradeSplit(d.rows), total = Math.max(1, d.rows.length), t = medianTimes(d.rows);
  const lines = LINES.map(([k, label, cls]) =>
    `<div class="grow"><span>${label}</span><div class="gbar"><i class="${cls}" style="width:${Math.round(100 * g[k] / total)}%"></i></div><b>${g[k]}</b></div>`).join('');
  const listen = d.rows.filter(r => r.mode === 'listen').length, hinted = d.rows.filter(r => Number(r.hinted)).length;
  const sec = v => (v === null ? '–' : `${v} с`);
  return `<h4>Оценки за 30 дней</h4>${lines}` +
    row(statCard(d.rows.length - listen, 'повторение') + statCard(listen, 'на слух') + statCard(hinted, 'с подсказкой'), 'stats s3') +
    row(statCard(sec(t.think), 'вспоминание'), 'stats s3') + `<div class="muted note">Медианное время до переворота (вспоминание) и на ответе — по ним подстраиваются пороги оценки: ответ ${sec(t.look)}.</div>`;
}
