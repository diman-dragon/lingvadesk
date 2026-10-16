import getSetting from '../settings/getSetting.js';
/** Всё, что меняет оценка, — чтобы её можно было отменить («↶»). review — id записи истории (заполняет gradeCard). */
export default async function snapshotGrade(session, card) {
  const { due, interval, ease, reps } = card;
  return {
    id: card.id, srs: { due, interval, ease, reps }, order: [...session.order], pos: session.pos,
    logLen: session.log.length, today: await getSetting('today', null), review: null
  };
}
