import esc from '../util/esc.js';
import button from './button.js';
/** Нижнее окно: затемнение и «закрыть» вызывают действие closeSheet; body — готовый HTML (прокручивается внутри окна). */
export default function sheetShell(title, body, closeLabel = 'Отмена') {
  return `<div class="sheet-bg" data-act="closeSheet"></div><div class="sheet"><h3>${esc(title)}</h3><div class="sheet-list">${body}</div>` +
    button({ act: 'closeSheet', cls: 'sheet-close', label: closeLabel }) + '</div>';
}
