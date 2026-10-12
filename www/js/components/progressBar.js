import esc from '../util/esc.js';
/** pct — заполнение (0–100), text — подпись слева, ctx — контекст справа (проект · колода). */
export default function progressBar({ pct, text }, ctx = '') {
  return `<div class="counter"><span>${esc(text)}</span><span class="ctx">${esc(ctx)}</span></div>` +
    `<div class="prog"><i style="width:${Math.round(pct)}%"></i></div>`;
}
