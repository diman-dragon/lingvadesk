import dbQuery from '../native/dbQuery.js';
export default function listSettings() { return dbQuery('SELECT key,value FROM settings'); }
