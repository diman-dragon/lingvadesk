import saveState from './saveState.js';
/** Листание по кругу: после последней карточки — первая, перед первой — последняя. */
export default async function cyclePos(session, delta) {
  const n = session.order.length;
  if (n) session.pos = (session.pos + delta + n) % n;
  await saveState(session);
}
