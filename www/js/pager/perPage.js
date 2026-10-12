import { state } from '../state/appState.js';
import { PAGER } from '../constants/PAGER.js';
/** Сколько элементов помещается на странице при высоте области height (px). */
export default function perPage(height) {
  if (state.pager.fixed) return 1;
  if (!height) return PAGER.fallback;
  if (state.prefs.layout === 'grid') return PAGER.cols * Math.max(1, Math.floor((height + PAGER.tileGap) / (PAGER.tile + PAGER.tileGap)));
  return Math.max(1, Math.floor((height + PAGER.gap) / (PAGER.row + PAGER.gap)));
}
