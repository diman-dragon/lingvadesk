import dbQuery from '../native/dbQuery.js';
/** Когда учились: уникальные 15-минутные отрезки ({ h } = ts / 900000) — из них считаются дни и серии (кратно часовым поясам). */
export default function listActiveHours() { return dbQuery('SELECT DISTINCT ts/900000 h FROM reviews'); }
