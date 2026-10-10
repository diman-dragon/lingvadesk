/** Две стороны в DOM; тап по карточке переворачивает её в любую сторону. */
export default function flipFaces(front, back, flipped) {
  return `<div class="flip${flipped ? ' flipped' : ''}" data-act="flip"><div class="flip-inner">` +
    `<div class="face front">${front}</div><div class="face back">${back}</div></div></div>`;
}
