import normText from './normText.js';
/** Ответ совпал с эталоном: без учёта регистра, пунктуации, диакритики у латиницы и ё/е; эталон «а, б / в» — подойдёт любой вариант. */
export default function sameAnswer(typed, answer) {
  const t = normText(typed);
  return !!t && [answer, ...String(answer).split(/[,;/]/)].some(v => normText(v) === t);
}
