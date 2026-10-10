import dbFirst from '../native/dbFirst.js';
export default function findCourseByName(name) { return dbFirst('SELECT id FROM languages WHERE name=?', [name]); }
