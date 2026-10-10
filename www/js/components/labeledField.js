import esc from '../util/esc.js';
export default function labeledField({ id, label, value = '', placeholder = '', multiline = false, list = '' }) {
  const attrs = `id="${id}" placeholder="${esc(placeholder)}"`;
  const input = multiline
    ? `<textarea ${attrs} rows="3">${esc(value)}</textarea>`
    : `<input ${attrs} value="${esc(value)}"${list ? ` list="${list}"` : ''}>`;
  return `<label class="field"><span>${esc(label)}</span>${input}</label>`;
}
