import dbRun from '../native/dbRun.js';
export default function deleteProject(id) { return dbRun('DELETE FROM languages WHERE id=?', [id]); }
