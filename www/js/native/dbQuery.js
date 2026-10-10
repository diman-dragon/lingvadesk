import plugin from './plugin.js';
export default function dbQuery(sql, params = []) {
  return plugin('DbQuery').exec({ sql, params }).then(r => r.rows);
}
