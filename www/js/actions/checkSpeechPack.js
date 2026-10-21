import listProjects from '../repo/listProjects.js';
import prepareSpeech from '../study/prepareSpeech.js';
import toast from '../dom/toast.js';
/** Настройки → «Проверить языки»: для голоса каждого проекта проверяет офлайн-пакет распознавания и, если нужно, запускает скачивание. */
export default async function checkSpeechPack() {
  const langs = [...new Set((await listProjects()).map(p => p.tts))];
  if (!langs.length) return toast('Проектов пока нет');
  const lines = [];
  for (const l of langs) lines.push(await prepareSpeech(l, true) || `${l}: проверить нельзя на этой версии Android`);
  toast(lines.join(' · '));
}
