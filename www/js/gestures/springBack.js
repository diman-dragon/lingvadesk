/** Возврат карточки на место, если жест не дотянул до порога. */
export default function springBack(el) {
  el.style.transition = 'transform .25s cubic-bezier(.2,.8,.2,1), opacity .25s';
  el.style.transform = '';
  el.style.opacity = '';
}
