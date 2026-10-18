import dbRun from '../native/dbRun.js';
/**
 * Запись истории (всё, что делает пользователь, пишется в базу): оценка, время до переворота / на ответе (мс), подсказка, число прослушиваний;
 * fresh — карточка была новой; mode — 'srs' | 'listen'. Возвращает id записи.
 */
export default function insertReview(cardId, grade, sig = {}, fresh = 0, mode = 'srs', ts = Date.now()) {
  const { think = null, look = null, hinted = false, plays = 0 } = sig;
  return dbRun('INSERT INTO reviews(card_id,ts,grade,think,look,fresh,mode,hinted,plays) VALUES(?,?,?,?,?,?,?,?,?)',
    [cardId, ts, grade, think, look, fresh ? 1 : 0, mode, hinted ? 1 : 0, plays || 0]);
}
