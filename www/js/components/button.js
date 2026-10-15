import esc from '../util/esc.js';
/** label — готовый HTML (экранируйте снаружи); data — атрибуты data-*; aria — подпись для значков без текста. */
export default function button({ act, label, cls = '', data = {}, aria = '' }) {
  const attrs = Object.entries(data).map(([k, v]) => ` data-${k}="${esc(v)}"`).join('');
  return `<button class="${cls}" data-act="${act}"${aria ? ` aria-label="${esc(aria)}"` : ''}${attrs}>${label}</button>`;
}
