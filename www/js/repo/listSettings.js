import dbQuery from '../native/dbQuery.js';
/** Только настройки: сохранённые сессии учёбы (session:*) не читаем при запуске. */
export default function listSettings() { return dbQuery("SELECT key,value FROM settings WHERE key NOT LIKE 'session:%'"); }
