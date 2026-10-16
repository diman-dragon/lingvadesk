import getScopeStats from '../repo/getScopeStats.js';
import listReviewsSince from '../repo/listReviewsSince.js';
import dayStart from '../util/dayStart.js';
import dayBars from '../study/dayBars.js';
import retention from '../study/retention.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import statCard from '../components/statCard.js';
import barChart from '../components/barChart.js';
import row from '../components/row.js';
/** Статистика по истории повторений: за 30 дней, удержание, выучено; столбики за 14 дней. */
export default async function statsView() {
  const [rows, all] = await Promise.all([listReviewsSince(dayStart(-29)), getScopeStats('all')]);
  const ret = retention(rows);
  const stats = row(statCard(rows.length, 'за 30 дней') + statCard(ret === null ? '–' : `${ret}%`, 'удержание') + statCard(all.mature, 'выучено'), 'stats s3');
  return header('Статистика', { left: backButton('back'), gear: false }) + stats + '<h3>Повторений по дням</h3>' + barChart(dayBars(rows)) +
    `<div class="muted note">Удержание — доля повторений без «снова» среди уже изученных карточек. Выучено — интервал от 21 дня (${all.mature} из ${all.total}).</div>`;
}
