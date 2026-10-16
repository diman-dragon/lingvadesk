import dbRun from '../native/dbRun.js';
/** Запись истории: оценка + время на вспоминание / ответ (мс, только для переворота); fresh — карточка была новой. Возвращает id. */
export default function insertReview(cardId, grade, { think = null, look = null } = {}, fresh = 0, ts = Date.now()) {
  return dbRun('INSERT INTO reviews(card_id,ts,grade,think,look,fresh) VALUES(?,?,?,?,?,?)', [cardId, ts, grade, think, look, fresh ? 1 : 0]);
}
