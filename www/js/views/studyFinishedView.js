import faceBox from '../components/faceBox.js';
import button from '../components/button.js';
import row from '../components/row.js';
const DONE = { srs: 'На сегодня всё! 🎉', learn: 'Пачка выучена! 🌱' };
const RESTART = { srs: 'Обновить', learn: 'Следующая пачка' };
export default function studyFinishedView(session) {
  const total = session.order.length, learn = session.mode === 'learn';
  const text = total ? DONE[session.mode] ?? 'Готово 🎉' : learn ? 'Новых слов нет' : 'Нет карточек для этого режима';
  const back = total ? button({ act: 'prev', label: '‹ Назад' }) : '';
  return faceBox(`<div class="big">${text}</div>`) + row(back + button({ act: 'restart', cls: 'p', label: RESTART[session.mode] ?? 'Сначала' }));
}
