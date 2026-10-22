import entry from './entry.js';
/** Игра как элемент списка / сетки: значок, название, пояснение, рекорд 🏆 справа. Нажатие — выбор колоды (actions/openGameKind). */
export default function gameEntry({ mode, icon, title, hint }, best) {
  return entry({ act: 'openGameKind', id: mode, title, sub: hint, lead: `<span class="avatar ico">${icon}</span>`, acts: `<span class="badge">🏆 ${best}</span>` });
}
