import speakerOf from '../util/speakerOf.js';
const ROLE = /^([ABCАВС123])\s*[:.)]\s*(.+)$/i, SPLIT = /\s+[|—–]\s+|\t/, HEAD = /^(lang|tts|язык)\s*:\s*(\S+)\s*$/i;
/**
 * Текст диалога → { name, lang, cards: [{ front, back, speaker }] } или null (это не диалог). Строка реплики: «A: фраза | перевод»
 * (роль A / B / C или 1 / 2 / 3; разделитель « | », « — » или табуляция). «# Название» и «lang: en-US» — необязательные заголовки.
 * Диалог — когда реплик не меньше двух и они составляют большинство непустых строк.
 */
export default function parseDialogText(text) {
  let name = '', lang = '', other = 0;
  const cards = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim(), h = HEAD.exec(line), m = ROLE.exec(line);
    if (!line) continue;
    if (line.startsWith('#') || h) { if (h) lang = h[2]; else if (!name) name = line.replace(/^#+\s*/, ''); continue; }
    const [front, back] = m ? m[2].split(SPLIT).map(s => s.trim()) : [];
    if (m && front && back) cards.push({ front, back, example: null, exampleTr: null, speaker: speakerOf(m[1]) }); else other++;
  }
  return cards.length >= 2 && cards.length >= 0.6 * (cards.length + other) ? { name, lang, cards } : null;
}
