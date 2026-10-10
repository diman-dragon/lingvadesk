import esc from '../util/esc.js';
/** label — готовый HTML (экранируйте снаружи); data — атрибуты data-*. */
export default function button({ act, label, cls = '', data = {} }) {
  const attrs = Object.entries(data).map(([k, v]) => ` data-${k}="${esc(v)}"`).join('');
  return `<button class="${cls}" data-act="${act}"${attrs}>${label}</button>`;
}
