import esc from '../util/esc.js';
import gearButton from './gearButton.js';
/** Шапка: слева «назад»/знак, справа действия экрана и настройки (gear: false — на формах и в самих настройках). */
export default function header(title, { left = '', right = '', gear = true } = {}) {
  return `<header>${left}<h1>${esc(title)}</h1>${right}${gear ? gearButton() : ''}</header>`;
}
