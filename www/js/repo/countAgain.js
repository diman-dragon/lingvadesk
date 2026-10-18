import dbFirst from '../native/dbFirst.js';
/** Сколько раз карточка получала «снова» в интервальном повторении. */
export default function countAgain(cardId) {
  return dbFirst("SELECT COUNT(*) n FROM reviews WHERE card_id=? AND grade='again' AND mode='srs'", [cardId]).then(r => Number(r.n));
}
