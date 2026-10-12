import dbBatch from '../native/dbBatch.js';
/** Сбрасывает SRS-состояние карточек и сохранённые позиции сессий. */
export default function resetProgress() {
  return dbBatch([
    { sql: 'UPDATE cards SET due=0,interval=0,reps=0,ease=2.5', params: [] },
    { sql: "DELETE FROM settings WHERE key LIKE 'session:%'", params: [] }
  ]);
}
