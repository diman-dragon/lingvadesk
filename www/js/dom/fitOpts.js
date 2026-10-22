import { OPT_FIT_MIN } from '../constants/OPT_FIT_MIN.js';
const over = b => b.scrollHeight > b.clientHeight + 1 || b.scrollWidth > b.clientWidth + 1;
/**
 * Варианты ответа (.opts): размер ячеек не меняется, а текст каждого варианта уменьшается шагами по 5 % (масштаб --fit на кнопке),
 * пока не поместится целиком; короткие варианты остаются крупными.
 */
export default function fitOpts() {
  for (const btn of [...document.querySelectorAll?.('.opts') ?? []].flatMap(box => [...box.children])) {
    let k = 1;
    btn.style.removeProperty('--fit');
    while (over(btn) && k > OPT_FIT_MIN) { k = Math.round((k - 0.05) * 100) / 100; btn.style.setProperty('--fit', k); }
  }
}
