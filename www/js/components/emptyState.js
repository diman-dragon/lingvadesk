import esc from '../util/esc.js';
/** actions — готовый HTML кнопок. */
export default function emptyState({ icon, title, text, actions = '' }) {
  return `<div class="empty"><div class="ei">${icon}</div><h2>${esc(title)}</h2><p>${esc(text)}</p>${actions}</div>`;
}
