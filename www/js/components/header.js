import esc from '../util/esc.js';
/** Шапка: слева «назад»/знак, справа действия экрана. Название при необходимости переносится на несколько строк. */
export default function header(title, { left = '', right = '' } = {}) {
  return `<header>${left}<h1>${esc(title)}</h1>${right}</header>`;
}
