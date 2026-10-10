import dbRun from '../native/dbRun.js';
export default function setSetting(key, value) {
  return dbRun('INSERT OR REPLACE INTO settings(key,value) VALUES(?,?)', [key, String(value)]);
}
