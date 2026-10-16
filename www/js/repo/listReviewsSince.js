import dbQuery from '../native/dbQuery.js';
export default function listReviewsSince(since) {
  return dbQuery('SELECT ts,grade,fresh FROM reviews WHERE ts>=? ORDER BY ts', [since]);
}
