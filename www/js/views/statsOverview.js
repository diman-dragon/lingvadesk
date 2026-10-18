import statCard from '../components/statCard.js';
import barChart from '../components/barChart.js';
import row from '../components/row.js';
import dayBars from '../study/dayBars.js';
import retention from '../study/retention.js';
/** Страница «Обзор»: повторения за периоды, удержание, серии, выучено и столбики по дням. d — данные statsView. */
export default function statsOverview(d) {
  const n7 = d.rows.filter(r => Number(r.ts) >= d.since7).length, ret = retention(d.rows);
  const mature = d.decks.reduce((a, x) => a + Number(x.mature), 0), cards = d.decks.reduce((a, x) => a + Number(x.total), 0);
  return row(statCard(d.today.n, 'сегодня') + statCard(n7, '7 дней') + statCard(d.rows.length, '30 дней') + statCard(d.total, 'всего'), 'stats') +
    row(statCard(ret === null ? '–' : `${ret}%`, 'удержание') + statCard(d.today.current, 'дней подряд') + statCard(d.today.best, 'лучшая серия') + statCard(`${mature}/${cards}`, 'выучено'), 'stats') +
    '<h4>Повторений по дням</h4>' + barChart(dayBars(d.rows));
}
