import dbRun from '../native/dbRun.js';
export default function deleteCourse(id) { return dbRun('DELETE FROM languages WHERE id=?', [id]); }
