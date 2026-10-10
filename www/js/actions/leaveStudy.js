import ttsStop from '../native/ttsStop.js';
import go from '../nav/go.js';
export default async function leaveStudy(d) {
  await ttsStop().catch(() => {});
  return go('deck', { id: +d.id });
}
