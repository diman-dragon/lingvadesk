import dbRun from '../native/dbRun.js';
export default function updateProject(id, name, tts) { return dbRun('UPDATE languages SET name=?,tts=? WHERE id=?', [name, tts, id]); }
