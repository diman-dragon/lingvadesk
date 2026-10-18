import esc from '../util/esc.js';
import { SPEECH } from '../constants/SPEECH.js';
import statCard from '../components/statCard.js';
import barChart from '../components/barChart.js';
import row from '../components/row.js';
import dayBars from '../study/dayBars.js';
/** Страница «Речь»: попытки произношения за 30 дней, средняя оценка, динамика по дням и слова, которые получаются хуже всего. */
export default function statsSpeech(d) {
  const n = d.speech.length, avg = n ? Math.round(100 * d.speech.reduce((a, r) => a + Number(r.score), 0) / n) : null;
  const ok = d.speech.filter(r => Number(r.score) >= SPEECH.good).length;
  const weak = d.weak.map(w => `<div class="hrow"><span>🎤 <b>${esc(w.front)}</b> · ${w.n}×</span><em>${Math.round(100 * Number(w.s))}%</em></div>`).join('');
  return row(statCard(n, 'попыток') + statCard(avg === null ? '–' : `${avg}%`, 'средняя оценка') + statCard(ok, 'удачных'), 'stats s3') +
    '<h4>Попыток по дням</h4>' + barChart(dayBars(d.speech)) + `<h4>Хуже всего получается</h4>${weak || '<div class="muted">Попыток пока нет — режим «Говорить» на вкладке «Учёба»</div>'}`;
}
