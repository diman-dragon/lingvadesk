import dbRun from '../native/dbRun.js';
export default function clearSetting(key) { return dbRun('DELETE FROM settings WHERE key=?', [key]); }
