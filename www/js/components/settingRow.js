import esc from '../util/esc.js';
export default function settingRow(title, controlHtml, hint = '') {
  const note = hint ? `<div class="s-hint">${esc(hint)}</div>` : '';
  return `<div class="setting"><div class="s-title">${esc(title)}</div>${controlHtml}${note}</div>`;
}
