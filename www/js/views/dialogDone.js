import esc from '../util/esc.js';
import button from '../components/button.js';
import faceBox from '../components/faceBox.js';
import row from '../components/row.js';
/** Итог сцены: сколько реплик, сколько своих произнесено и средняя точность; «Ещё раз», «Сменить роль», «К учёбе». */
export default function dialogDone(d) {
  const n = d.results.length, avg = n ? Math.round(100 * d.results.reduce((a, r) => a + r.score, 0) / n) : 0;
  const mine = n ? `<div class="sum"><div><b>${d.lines.length}</b><span>реплик</span></div><div><b>${n}</b><span>ваших</span></div><div><b>${avg}%</b><span>точность</span></div></div>` : `<div class="muted">${d.lines.length} реплик прослушано</div>`;
  return faceBox(`<div class="muted">Сцена закончена</div><div class="big long">${esc(d.name)}</div>${mine}`) +
    row(button({ act: 'back', label: 'К учёбе' }) + button({ act: 'dialogSetup', label: 'Сменить роль' }) + button({ act: 'dialogStart', cls: 'p', label: 'Ещё раз' }));
}
