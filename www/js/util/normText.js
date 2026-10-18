const strip = w => w.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
/** Текст для сравнения: без регистра, пунктуации, диакритики у латиницы; ё = е; пробелы схлопнуты. */
export default function normText(s) {
  return String(s).toLowerCase().replace(/[a-z\u00c0-\u024f]+/g, strip).replace(/ё/g, 'е').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}
