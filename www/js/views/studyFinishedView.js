import faceBox from '../components/faceBox.js';
import button from '../components/button.js';
import row from '../components/row.js';
import sessionSummary from './sessionSummary.js';
const DONE = { srs: 'Всё повторено! 🎉', learn: 'Пачка выучена! 🌱' };
const NONE = { srs: 'На сегодня всё! 🎉', learn: 'Новых слов нет', review: 'В колоде нет карточек' };
const AGAIN = { srs: 'Обновить', learn: 'Следующая пачка', review: 'Другая колода' };
export default function studyFinishedView(session) {
  const text = session.total ? DONE[session.mode] : NONE[session.mode];
  return faceBox(`<div class="big">${text}</div>${sessionSummary(session)}`) +
    row(button({ act: 'back', label: 'К учёбе' }) + button({ act: 'restart', cls: 'p', label: AGAIN[session.mode] }));
}
