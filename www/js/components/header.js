import esc from '../util/esc.js';
/** Шапка: слева «назад»/знак, справа действия экрана. Длинное название мельче (long > 28 знаков, xlong > 60) и переносится на несколько строк. */
export default function header(title, { left = '', right = '' } = {}) {
  const size = title.length > 60 ? ' class="xlong"' : title.length > 28 ? ' class="long"' : '';
  return `<header>${left}<h1${size}>${esc(title)}</h1>${right}</header>`;
}
