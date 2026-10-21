import barChart from '../components/barChart.js';
import forecastBars from '../study/forecastBars.js';
/** Параметр «Прогноз»: сколько карточек придёт на повторение в ближайшую неделю. */
export default function forecast(d) {
  const bars = forecastBars(d.dues), n = bars.reduce((a, b) => a + b.n, 0);
  return { icon: '🔮', title: 'Прогноз', value: n, sub: 'придёт на повторение за неделю', detail: `<h4>Придёт на повторение</h4>${barChart(bars)}` };
}
