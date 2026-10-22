import esc from '../util/esc.js';
import button from './button.js';
/**
 * Варианты ответа (викторина, игра): act — действие кнопки, mark(i) — класс результата (' ok' / ' bad' / '').
 * Поведение всегда одно: сетка 2 столбца, высота фиксирована (1 ряд при ≤ 2 вариантах, иначе 2), ничего не прокручивается;
 * если текст не помещается, он уменьшается сразу во всех вариантах (dom/fitOpts).
 */
export default function optGrid(options, act, mark = () => '') {
  const opts = options.map((t, i) => button({ act, cls: `opt${mark(i)}`, label: esc(t), data: { i } })).join('');
  return `<div class="opts${options.length > 2 ? '' : ' r1'}">${opts}</div>`;
}
