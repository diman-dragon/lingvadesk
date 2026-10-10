import esc from '../util/esc.js';
export default function field(id, placeholder) { return `<input id="${id}" placeholder="${esc(placeholder)}">`; }
