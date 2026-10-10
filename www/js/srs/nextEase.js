import { MIN_EASE } from '../constants/MIN_EASE.js';
export default function nextEase(ease, grade) {
  if (grade === 'again') return Math.max(MIN_EASE, ease - 0.2);
  if (grade === 'hard') return Math.max(MIN_EASE, ease - 0.15);
  return grade === 'easy' ? ease + 0.15 : ease;
}
