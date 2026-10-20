import { DAY_MS } from '../constants/DAY_MS.js';
/** Метка карточки: новая, пора повторить или когда придёт срок. */
export default function cardMark(c, now = Date.now()) {
  if (!c.due) return '<span class="mark new">новая</span>';
  if (c.due <= now) return '<span class="mark due">повторить</span>';
  const days = Math.ceil((c.due - now) / DAY_MS);
  return `<span class="mark ok">${days > 0 && c.due - now >= DAY_MS / 2 ? `через ${days} дн.` : 'сегодня'}</span>`;
}
