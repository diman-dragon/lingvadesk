import plugin from './plugin.js';
/** Возвращает last_insert_rowid. */
export default function dbRun(sql, params = []) {
  return plugin('DbRun').exec({ sql, params }).then(r => r.id);
}
