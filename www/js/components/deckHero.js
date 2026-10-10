import esc from '../util/esc.js';
export default function deckHero({ title, sub, chips }) {
  return `<div class="hero"><div class="hero-t">${esc(title)}</div><div class="hero-s">${esc(sub)}</div><div class="chips">${chips}</div></div>`;
}
