import entry from './entry.js';
import studyInfo from './studyInfo.js';
import avatar from './avatar.js';
const LEAD = { all: '<span class="avatar ico">🗂️</span>', whole: '<span class="avatar ico">📚</span>' };
/**
 * Элемент экрана режима: d — { name, pname, n, total, mature, newAll, left, late }. act — действие нажатия, id — его data-id;
 * kind: 'all' («Все колоды»), 'whole' («Весь проект»), 'project' (проект: открывает его колоды), 'deck'. Сводка и «выучено · в процессе · новых».
 */
export default function deckEntry(d, act, id, kind = 'deck') {
  const learned = d.total - d.newAll, from = kind === 'deck' ? d.pname : `колод: ${d.n}`;
  return entry({
    act, id, title: d.name, lead: LEAD[kind] ?? avatar(d.name), sub: `${from} · выучено ${d.mature} · в процессе ${learned - d.mature} · новых ${d.newAll}`,
    mark: studyInfo({ total: d.total, learned, left: d.left, late: d.late })
  });
}
