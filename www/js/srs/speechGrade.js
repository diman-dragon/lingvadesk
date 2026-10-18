import { SPEECH } from '../constants/SPEECH.js';
/**
 * Оценка по произношению: сходство → easy / good / hard / again (границы — constants/SPEECH).
 * «Легко» — только с первой попытки и без подсказки; подсмотренный текст опускает оценку на ступень (easy → good → hard).
 */
export default function speechGrade(score, attempts = 1, hinted = false) {
  const base = score >= SPEECH.easy && attempts === 1 ? 'easy' : score >= SPEECH.good ? 'good' : score >= SPEECH.hard ? 'hard' : 'again';
  if (!hinted) return base;
  return base === 'easy' ? 'good' : base === 'good' ? 'hard' : base;
}
