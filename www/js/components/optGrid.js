import esc from '../util/esc.js';
import button from './button.js';
/**
 * Варианты ответа (викторина, игра): act — действие кнопки, mark(i) — класс результата (' ok' / ' bad' / ''). Длинные варианты идут в один столбец
 * (.one) и мельче (.long); если вариантов слишком много для экрана, список прокручивается внутри себя.
 */
export default function optGrid(options, act, mark = () => '') {
  const opts = options.map((t, i) => button({ act, cls: `opt${t.length > 60 ? ' long' : ''}${mark(i)}`, label: esc(t), data: { i } })).join('');
  return `<div class="opts${options.some(t => t.length > 24) ? ' one' : ''}">${opts}</div>`;
}
