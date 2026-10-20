import esc from '../util/esc.js';
/** Крупный текст карточки; длинные слова и фразы автоматически мельче (long > 30 знаков, xlong > 90). attrs — например ' hidden'. */
export default function big(text, cls = '', attrs = '') {
  const size = text.length > 90 ? ' xlong' : text.length > 30 ? ' long' : '';
  return `<div class="big${size}${cls ? ` ${cls}` : ''}"${attrs}>${esc(text)}</div>`;
}
