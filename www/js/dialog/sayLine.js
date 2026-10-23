import { DIALOG } from '../constants/DIALOG.js';
import ttsSpeak from '../native/ttsSpeak.js';
import speechParams from '../tts/speechParams.js';
import toast from '../dom/toast.js';
import slotOf from './slotOf.js';
import sleep from './sleep.js';
/**
 * Озвучивает реплику её голосом и ждёт окончания (не дольше DIALOG.maxWaitMs). Голос недоступен — сообщение и пауза по длине текста
 * (реплику можно прочитать глазами), сцена не рвётся.
 */
export default async function sayLine(d, line) {
  let limit;
  try {
    const cap = new Promise(done => { limit = setTimeout(done, DIALOG.maxWaitMs); });
    await Promise.race([ttsSpeak(line.front, d.lang, { ...speechParams(d.lang, slotOf(line.role)), wait: true }), cap]);
  } catch (e) {
    toast(e.message || 'Озвучивание недоступно');
    await sleep(DIALOG.baseMs + DIALOG.msPerChar * line.front.length);
  } finally { clearTimeout(limit); }
}
