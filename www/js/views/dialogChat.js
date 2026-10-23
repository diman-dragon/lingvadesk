import { state } from '../state/appState.js';
import { DIALOG } from '../constants/DIALOG.js';
import esc from '../util/esc.js';
/** Чат сцены: реплики до текущей включительно (роль, текст, перевод — по настройке «Перевод под репликами»); нажатие на реплику — прозвучит ещё раз. */
export default function dialogChat(d, names) {
  const bubbles = d.lines.slice(0, d.i + 1).map((l, i) => {
    const cls = `bub r${l.role}${l.role === d.you ? ' you' : ''}${i === d.i ? ' cur' : ''}`, tr = state.prefs.dialogTr === 'on' ? `<div class="btr">${esc(l.back)}</div>` : '';
    return `<div class="${cls}" data-act="dialogSay" data-i="${i}"><b>${DIALOG.marks[l.role]} ${esc(names[l.role])}</b><div class="bt">${esc(l.front)}</div>${tr}</div>`;
  });
  return `<div id="chat" class="chat">${bubbles.join('')}</div>`;
}
