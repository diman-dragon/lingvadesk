/** Волны на значке озвучки играют, пока слово произносится (≈ 1,2 с). */
export default function pulse(el) {
  if (!el?.classList) return;
  el.classList.add('on');
  setTimeout(() => el.classList.remove('on'), 1200);
}
