import esc from '../util/esc.js';
/** Выбор области учёбы: вся библиотека / проект целиком / колода. */
export default function scopeSelect({ projects, decks, value }) {
  const sel = v => (v === value ? ' selected' : '');
  const groups = projects.map(p => {
    const own = decks.filter(d => d.project_id === p.id).map(d => `<option value="d:${d.id}"${sel('d:' + d.id)}>${esc(d.name)}</option>`).join('');
    return `<optgroup label="${esc(p.name)}"><option value="p:${p.id}"${sel('p:' + p.id)}>Весь проект</option>${own}</optgroup>`;
  }).join('');
  return `<label class="field"><span>Что учим</span><select id="scope" data-act="setScope" data-on="change">` +
    `<option value="all"${sel('all')}>Вся библиотека</option>${groups}</select></label>`;
}
