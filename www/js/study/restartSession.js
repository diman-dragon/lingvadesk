import buildOrder from './buildOrder.js';
import introCount from './introCount.js';
import saveState from './saveState.js';
export default async function restartSession(session) {
  session.order = buildOrder(session.mode, [...session.map.values()]);
  session.intro = introCount(session.mode, session.order);
  session.pos = 0;
  await saveState(session);
}
