/** Две стороны в DOM; тап по карточке переворачивает её в любую сторону (act = '' — карточка не реагирует на тап: вопрос с выбором / вводом). */
export default function flipFaces(front, back, flipped, act = 'flip') {
  return `<div class="flip${flipped ? ' flipped' : ''}"${act ? ` data-act="${act}"` : ''}><div class="flip-inner">` +
    `<div class="face front">${front}</div><div class="face back">${back}</div></div></div>`;
}
