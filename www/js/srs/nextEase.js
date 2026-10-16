import { MIN_EASE } from '../constants/MIN_EASE.js';
/** lapsing — карточка уже в «переучивании» (повторный провал подряд): ease падает сильнее, чем при первом. */
export default function nextEase(ease, grade, lapsing = false) {
  if (grade === 'again') return Math.max(MIN_EASE, ease - (lapsing ? 0.2 : 0.1));
  if (grade === 'hard') return Math.max(MIN_EASE, ease - 0.15);
  return grade === 'easy' ? ease + 0.15 : ease;
}
