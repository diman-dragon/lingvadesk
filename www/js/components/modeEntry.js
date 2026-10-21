import entry from './entry.js';
import studyInfo from './studyInfo.js';
/** Режим учёбы как элемент списка / сетки (как проект или колода): значок, название, пояснение, сводка (info — для studyInfo), extra — готовый HTML справа (🏆). Нажатие — экран колод режима. */
export default function modeEntry({ mode, icon, title, hint }, info, extra = '') {
  return entry({ act: 'openMode', id: mode, title, sub: hint, lead: `<span class="avatar ico">${icon}</span>`, mark: studyInfo(info), acts: extra && `<span class="badge">${extra}</span>` });
}
