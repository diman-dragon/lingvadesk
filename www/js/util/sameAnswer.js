const strip = w => w.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const norm = s => String(s).toLowerCase().replace(/[a-z\u00c0-\u024f]+/g, strip).replace(/ё/g, 'е').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
/** Ответ совпал с эталоном: без учёта регистра, пунктуации, диакритики у латиницы и ё/е; эталон «а, б / в» — подойдёт любой вариант. */
export default function sameAnswer(typed, answer) {
  const t = norm(typed);
  return !!t && [answer, ...String(answer).split(/[,;/]/)].some(v => norm(v) === t);
}
