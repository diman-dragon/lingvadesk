import nextSrs from './nextSrs.js';
/** Подпись под кнопкой оценки: когда карточка вернётся (мин / д / мес). */
export default function previewLabel(card, grade, now = Date.now()) {
  const s = nextSrs(card, grade, now);
  const min = Math.round((s.due - now) / 60000);
  if (min < 60) return `${min} мин`;
  if (s.interval < 30) return `${s.interval} д`;
  return `${Math.round(s.interval / 30)} мес`;
}
