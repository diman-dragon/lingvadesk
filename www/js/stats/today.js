import statCard from '../components/statCard.js';
import barChart from '../components/barChart.js';
import row from '../components/row.js';
import dayBars from '../study/dayBars.js';
/** Параметр «Сегодня»: повторений за сегодня; в окне — за 7 / 30 дней и всего и столбики по дням. */
export default function today(d) {
  const n7 = d.rows.filter(r => Number(r.ts) >= d.since7).length;
  return {
    icon: '📅', title: 'Сегодня', value: d.today.n, sub: `7 дней: ${n7} · 30 дней: ${d.rows.length} · всего: ${d.total}`,
    detail: row(statCard(d.today.n, 'сегодня') + statCard(n7, '7 дней') + statCard(d.rows.length, '30 дней') + statCard(d.total, 'всего'), 'stats') + '<h4>Повторений по дням</h4>' + barChart(dayBars(d.rows))
  };
}
