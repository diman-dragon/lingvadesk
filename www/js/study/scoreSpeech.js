import normText from '../util/normText.js';
import levenshtein from '../util/levenshtein.js';
/**
 * Оценка произношения 0…1: насколько услышанное похоже на нужный текст (лучший из вариантов распознавания; по символам, поэтому
 * слова и фразы считаются одинаково). Известная уверенность распознавателя (> 0) слегка смещает оценку (×0,85…1).
 * Распознаватель понимает речь, а не разбирает звуки: оценка отвечает на вопрос «вас поняли?».
 */
export default function scoreSpeech({ text = '', alternatives = [], confidence = -1 }, expected) {
  const want = normText(expected);
  if (!want) return 0;
  const sim = heard => { const t = normText(heard); return t ? 1 - levenshtein(t, want) / Math.max(t.length, want.length) : 0; };
  const best = Math.max(0, ...[text, ...alternatives].map(sim));
  return Math.round(best * (confidence > 0 && confidence <= 1 ? 0.85 + 0.15 * confidence : 1) * 100) / 100;
}
