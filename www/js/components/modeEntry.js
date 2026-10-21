import entry from './entry.js';
/** Режим учёбы как элемент списка / сетки (как проект или колода): значок, название, пояснение, число в значке. Нажатие — меню колод. */
export default function modeEntry({ mode, icon, title, hint }, count) {
  return entry({ act: 'openSheet', id: mode, title, sub: hint, lead: `<span class="avatar ico">${icon}</span>`, acts: `<span class="badge">${count}</span>` });
}
