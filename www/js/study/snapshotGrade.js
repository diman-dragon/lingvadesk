/** Всё, что меняет оценка, — чтобы её можно было отменить («↶»). review — id записи истории (заполняет gradeCard). */
export default function snapshotGrade(session, card) {
  const { due, interval, ease, reps } = card;
  return { id: card.id, srs: { due, interval, ease, reps }, order: [...session.order], pos: session.pos, logLen: session.log.length, review: null };
}
