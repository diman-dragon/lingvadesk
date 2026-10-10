import button from './button.js';
import row from './row.js';
/** save — действие сохранения; more — «сохранить и добавить ещё»; del — действие удаления (только при редактировании). */
export default function formButtons({ save, more = false, del = '' }) {
  const main = button({ act: save, cls: 'p', label: 'Сохранить' }) + button({ act: 'back', label: 'Отмена' });
  const again = more ? row(button({ act: save, label: 'Сохранить и добавить ещё', data: { more: 1 } })) : '';
  const remove = del ? row(button({ act: del, cls: 'd', label: 'Удалить' })) : '';
  return row(main) + again + remove;
}
