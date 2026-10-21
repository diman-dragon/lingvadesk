import statCard from '../components/statCard.js';
import row from '../components/row.js';
/** Параметр «Серия»: дней подряд, в которые вы занимались, и лучшая серия. */
export default function streak(d) {
  return {
    icon: '🔥', title: 'Серия', value: d.today.current, sub: `дней подряд · лучшая ${d.today.best}`,
    detail: row(statCard(d.today.current, 'дней подряд') + statCard(d.today.best, 'лучшая серия'), 'stats s3') + '<div class="muted note">Серия растёт, если в день было хоть одно повторение или игра.</div>'
  };
}
