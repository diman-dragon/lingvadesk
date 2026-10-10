import esc from '../util/esc.js';
export default function statCard(value, label) {
  return `<div class="stat"><b>${esc(value)}</b><span>${esc(label)}</span></div>`;
}
