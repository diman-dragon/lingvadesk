import esc from '../util/esc.js';
import { AVATAR_COLORS } from '../constants/AVATAR_COLORS.js';
/** Круглая плашка с первой буквой; цвет выбирается по названию из фирменной палитры. */
export default function avatar(text) {
  const i = [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % AVATAR_COLORS.length;
  return `<span class="avatar" style="background:${AVATAR_COLORS[i]}">${esc(text.slice(0, 1).toUpperCase())}</span>`;
}
