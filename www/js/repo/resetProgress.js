import dbBatch from '../native/dbBatch.js';
/** Сбрасывает расписание карточек и всю историю (повторения, проверки произношения). Сами карточки и колоды остаются. */
export default function resetProgress() {
  return dbBatch([
    { sql: 'UPDATE cards SET due=0,interval=0,reps=0,ease=2.5', params: [] },
    { sql: 'DELETE FROM reviews', params: [] },
    { sql: 'DELETE FROM pronunciations', params: [] }
  ]);
}
