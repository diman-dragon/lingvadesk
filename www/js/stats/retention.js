import statCard from '../components/statCard.js';
import row from '../components/row.js';
import retentionOf from '../study/retention.js';
/** Параметр «Удержание»: доля повторений без «снова» среди уже изучавшихся карточек (30 дней). */
export default function retention(d) {
  const r = retentionOf(d.rows), v = r === null ? '–' : `${r}%`;
  return {
    icon: '🎯', title: 'Удержание', value: v, sub: 'повторения без «снова», 30 дней',
    detail: row(statCard(v, 'удержание'), 'stats s3') + '<div class="muted note">Считается по интервальному повторению: сколько раз вы вспомнили карточку, которую уже учили.</div>'
  };
}
