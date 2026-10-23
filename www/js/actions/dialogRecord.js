import { state } from '../state/appState.js';
import { SPEECH } from '../constants/SPEECH.js';
import speechListen from '../native/speechListen.js';
import prepareSpeech from '../study/prepareSpeech.js';
import scoreSpeech from '../study/scoreSpeech.js';
import insertPronunciation from '../repo/insertPronunciation.js';
import show from '../dialog/show.js';
import toast from '../dom/toast.js';
import buzz from '../dom/buzz.js';
/** Микрофон на реплике пользователя: одна попытка, оценка сходства с текстом реплики (попытка пишется в pronunciations); можно повторить, затем «Дальше». */
export default async function dialogRecord() {
  const d = state.dialog, line = d.lines[d.i];
  if (!d.waiting || d.listening) return;
  d.listening = true;
  await show();
  try {
    await prepareSpeech(d.lang);
    const r = await speechListen(d.lang), score = scoreSpeech(r, line.front);
    await insertPronunciation(line.id, { engine: SPEECH.engine, transcript: r.text, score, audio: r.audio ?? null });
    d.heard = { text: r.text, score };
    buzz(score >= SPEECH.good ? 12 : [30, 40, 30]);
  } catch (e) { toast(e.message || 'Не удалось распознать речь'); }
  d.listening = false;
  await show();
}
