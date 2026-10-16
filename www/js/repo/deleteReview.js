import dbRun from '../native/dbRun.js';
export default function deleteReview(id) { return dbRun('DELETE FROM reviews WHERE id=?', [id]); }
