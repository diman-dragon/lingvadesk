import saveState from './saveState.js';
export default async function movePos(session, delta) {
  session.pos = Math.max(0, Math.min(session.pos + delta, session.order.length));
  await saveState(session);
}
