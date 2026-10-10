import sectionTitle from './sectionTitle.js';
export default function settingsGroup(title, rowsHtml) { return sectionTitle(title) + `<div class="group">${rowsHtml}</div>`; }
