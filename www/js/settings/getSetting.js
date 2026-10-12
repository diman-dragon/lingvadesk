import dbFirst from '../native/dbFirst.js';
export default function getSetting(key, fallback = null) {
  return dbFirst('SELECT value FROM settings WHERE key=?', [key]).then(r => r?.value ?? fallback);
}
