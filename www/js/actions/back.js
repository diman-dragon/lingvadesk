import ttsStop from '../native/ttsStop.js';
import goBack from '../nav/goBack.js';
/** «Назад» в интерфейсе = системная «Назад»; озвучка при выходе останавливается. */
export default async function back() {
  await ttsStop().catch(() => {});
  return goBack();
}
