import statCard from '../components/statCard.js';
import row from '../components/row.js';
/** Параметр «Режимы»: повторения «на слух» и с подсказкой за 30 дней. */
export default function modes(d) {
  const listen = d.rows.filter(r => r.mode === 'listen').length, hinted = d.rows.filter(r => Number(r.hinted)).length;
  return {
    icon: '🎧', title: 'На слух и подсказки', value: listen, sub: `с подсказкой: ${hinted}`,
    detail: row(statCard(d.rows.length - listen, 'повторение') + statCard(listen, 'на слух') + statCard(hinted, 'с подсказкой'), 'stats s3')
  };
}
