/** Листание по кругу: после последней карточки — первая, перед первой — последняя. */
export default function cyclePos(session, delta) {
  const n = session.order.length;
  if (n) session.pos = (session.pos + delta + n) % n;
}
