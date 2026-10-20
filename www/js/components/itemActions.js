import button from './button.js';
import penIcon from './penIcon.js';
import trashIcon from './trashIcon.js';
/** Карандаш и корзина на элементе списка: edit / del — имена действий, id — что менять / удалять. Готовый HTML. */
export default function itemActions(edit, del, id) {
  const icon = (act, aria, svg) => button({ act, cls: 'ib', label: svg, aria, data: { id } });
  return `<span class="acts">${icon(edit, 'Изменить', penIcon())}${icon(del, 'Удалить', trashIcon())}</span>`;
}
