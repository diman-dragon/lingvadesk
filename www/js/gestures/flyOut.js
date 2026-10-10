import { SWIPE } from '../constants/SWIPE.js';
/** Карточка улетает за край экрана; вперёд — влево, назад — вправо. */
export default function flyOut(el, forward) {
  el.style.transition = `transform ${SWIPE.flyMs}ms ease-in, opacity ${SWIPE.flyMs}ms`;
  el.style.transform = `translateX(${forward ? '-130%' : '130%'}) rotate(${forward ? -14 : 14}deg)`;
  el.style.opacity = '0';
  return new Promise(resolve => setTimeout(resolve, SWIPE.flyMs));
}
