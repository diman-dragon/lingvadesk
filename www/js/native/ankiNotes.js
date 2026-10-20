import plugin from './plugin.js';
/** Заметки Anki из SQLite-коллекции (base64): → [[поле1, поле2, …], …]. Читает нативный плагин: в JS нет SQLite для чужих файлов. */
export default function ankiNotes(base64) { return plugin('AnkiNotes').exec({ data: base64 }).then(r => r.notes); }
