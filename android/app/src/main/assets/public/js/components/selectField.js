import esc from '../util/esc.js';
/** options: [[значение, подпись], ...] */
export default function selectField({ id, label, options, value }) {
  const opts = options.map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(value) ? ' selected' : ''}>${esc(l)}</option>`).join('');
  return `<label class="field"><span>${esc(label)}</span><select id="${id}">${opts}</select></label>`;
}
