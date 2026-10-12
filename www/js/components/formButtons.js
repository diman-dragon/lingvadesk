import button from './button.js';
import row from './row.js';
/** Одним рядом (форма не должна прокручиваться): сохранить, «＋ ещё» (новая карточка) или удалить (правка), отмена. */
export default function formButtons({ save, more = false, del = '' }) {
  const parts = [button({ act: save, cls: 'p', label: 'Сохранить' })];
  if (more) parts.push(button({ act: save, label: '＋ ещё', data: { more: 1 } }));
  parts.push(button({ act: 'back', label: 'Отмена' }));
  if (del) parts.push(button({ act: del, cls: 'd', label: '🗑' }));
  return row(parts.join(''), 'foot');
}
