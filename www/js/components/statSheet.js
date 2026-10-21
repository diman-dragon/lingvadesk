import sheetShell from './sheetShell.js';
/** Подробное окно параметра статистики: p — { icon, title, detail } из stats/*. */
export default function statSheet(p) { return sheetShell(`${p.icon} ${p.title}`, `<div class="group">${p.detail}</div>`, 'Закрыть'); }
