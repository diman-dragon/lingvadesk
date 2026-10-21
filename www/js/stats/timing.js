import statCard from '../components/statCard.js';
import row from '../components/row.js';
import medianTimes from '../study/medianTimes.js';
/** Параметр «Время»: медианное время на вспоминание и на ответ (по ним подстраиваются пороги оценки). */
export default function timing(d) {
  const t = medianTimes(d.rows), sec = v => (v === null ? '–' : `${v} с`);
  return {
    icon: '⏱️', title: 'Время', value: sec(t.think), sub: `ответ: ${sec(t.look)}`,
    detail: row(statCard(sec(t.think), 'вспоминание') + statCard(sec(t.look), 'ответ'), 'stats s3') + '<div class="muted note">Медианное время до переворота (вспоминание) и на ответе — по ним подстраиваются пороги оценки.</div>'
  };
}
