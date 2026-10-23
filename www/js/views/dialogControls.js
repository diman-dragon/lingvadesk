import button from '../components/button.js';
import micIcon from '../components/micIcon.js';
import row from '../components/row.js';
import speechResult from './speechResult.js';
/** Низ экрана сцены: ход (‹ ⏸/▶ ›) или, на вашей реплике, микрофон с оценкой, «Послушать» и «Дальше». */
export default function dialogControls(d) {
  if (!d.waiting) {
    return row(button({ act: 'dialogPrev', cls: 'icon', label: '‹', aria: 'Реплика назад' }) + button({ act: 'dialogToggle', cls: 'p wide', label: d.playing ? '⏸ Пауза' : '▶ Дальше по сцене' }) +
      button({ act: 'dialogNext', cls: 'icon', label: '›', aria: 'Пропустить реплику' }), 'nav-row');
  }
  const mic = button({ act: 'dialogRecord', cls: `speak lg mic${d.listening ? ' rec' : ''}`, label: micIcon(), aria: 'Сказать' });
  const res = d.listening ? '<div class="sres">Слушаю…</div>' : d.heard ? speechResult({ heard: d.heard.text, score: d.heard.score, attempts: 1 }) : '<div class="muted">Ваша реплика — скажите её вслух</div>';
  return `<div id="speechres" class="dres">${res}</div>` + row(button({ act: 'dialogSay', cls: 'sm', label: '🔈 Послушать', data: { i: d.i } }) + mic + button({ act: 'dialogNext', cls: 'p', label: d.heard ? 'Дальше' : 'Пропустить' }), 'nav-row');
}
