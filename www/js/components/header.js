import esc from '../util/esc.js';
export default function header(title, { left = '', right = '' } = {}) {
  return `<header>${left}<h1>${esc(title)}</h1>${right}</header>`;
}
