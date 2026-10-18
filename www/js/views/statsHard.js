import esc from '../util/esc.js';
import barChart from '../components/barChart.js';
import forecastBars from '../study/forecastBars.js';
/** Страница «Трудные»: карточки с наибольшим числом «снова» и прогноз повторений на неделю. */
export default function statsHard(d) {
  const hard = d.hard.map(c => `<div class="hrow"><span>🐛 <b>${esc(c.front)}</b> — ${esc(c.back)}</span><em>${c.n}×</em></div>`).join('');
  return `<h4>Чаще всего «снова»</h4>${hard || '<div class="muted">Трудных карточек пока нет</div>'}<h4>Придёт на повторение</h4>${barChart(forecastBars(d.dues))}`;
}
