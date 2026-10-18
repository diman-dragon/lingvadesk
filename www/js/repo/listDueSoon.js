import dbQuery from '../native/dbQuery.js';
/** Сроки повторения ({ due }) карточек, которые наступят раньше until (мс), включая просроченные, — для прогноза. */
export default function listDueSoon(until) { return dbQuery('SELECT due FROM cards WHERE due>0 AND due<?', [until]); }
