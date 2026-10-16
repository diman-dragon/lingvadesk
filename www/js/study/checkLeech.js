import { BEHAVIOR } from '../constants/BEHAVIOR.js';
import { DAY_MS } from '../constants/DAY_MS.js';
import countAgain from '../repo/countAgain.js';
import updateCardSrs from '../repo/updateCardSrs.js';
import toast from '../dom/toast.js';
/** «Пиявка»: карточка в пятый раз получила «снова» — откладываем на пару дней и предлагаем поправить (долгое нажатие на карточку). */
export default async function checkLeech(session, card) {
  if (await countAgain(card.id) < BEHAVIOR.leech) return;
  card.due = Date.now() + BEHAVIOR.leechDays * DAY_MS;
  await updateCardSrs(card.id, card);
  session.order = session.order.filter(id => id !== card.id);
  if (session.pos >= session.order.length) session.pos = 0;
  if (globalThis.document) toast(`🐛 «${card.front}» даётся трудно — отложена на ${BEHAVIOR.leechDays} дн. Удерживайте карточку, чтобы поправить её`);
}
