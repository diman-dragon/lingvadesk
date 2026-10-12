import faceBox from '../components/faceBox.js';
import button from '../components/button.js';
import row from '../components/row.js';
const DONE = { srs: 'Всё повторено! 🎉', learn: 'Пачка выучена! 🌱' };
const NONE = { srs: 'На сегодня всё! 🎉', learn: 'Новых слов нет', review: 'В области нет карточек' };
const AGAIN = { srs: 'Обновить', learn: 'Следующая пачка', review: 'Заново' };
export default function studyFinishedView(session) {
  const text = session.total ? DONE[session.mode] : NONE[session.mode];
  return faceBox(`<div class="big">${text}</div>`) +
    row(button({ act: 'back', label: 'К учёбе' }) + button({ act: 'restart', cls: 'p', label: AGAIN[session.mode] }));
}
