import dbQuery from '../native/dbQuery.js';
/** Последние повторения с переворотом (есть время и до переворота, и на ответе) — для калибровки порогов. */
export default function listRecentReviews(limit) {
  return dbQuery(`SELECT think,look FROM reviews WHERE think IS NOT NULL AND look IS NOT NULL ORDER BY id DESC LIMIT ${Number(limit) | 0}`);
}
