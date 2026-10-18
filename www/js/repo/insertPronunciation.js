import dbRun from '../native/dbRun.js';
/** Попытка произношения: движок, распознанный текст, оценка 0…1 и путь к записи (audio — null: записи пока не сохраняются, поле предусмотрено). */
export default function insertPronunciation(cardId, { engine, transcript, score, audio = null }, ts = Date.now()) {
  return dbRun('INSERT INTO pronunciations(card_id,ts,engine,transcript,score,audio) VALUES(?,?,?,?,?,?)', [cardId, ts, engine, transcript, score, audio]);
}
