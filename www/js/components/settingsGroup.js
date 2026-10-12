import esc from '../util/esc.js';
export default function settingsGroup(title, rowsHtml) { return `<h3>${esc(title)}</h3><div class="group">${rowsHtml}</div>`; }
