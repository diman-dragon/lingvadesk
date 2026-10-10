import dbQuery from './dbQuery.js';
export default function dbFirst(sql, params = []) { return dbQuery(sql, params).then(rows => rows[0]); }
