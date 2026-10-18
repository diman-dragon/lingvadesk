import dbQuery from '../native/dbQuery.js';
export default function listReviewsSince(since) {
  return dbQuery('SELECT ts,grade,fresh,mode,think,look,hinted,plays FROM reviews WHERE ts>=? ORDER BY ts', [since]);
}
