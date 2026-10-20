import detectDelimiter from './detectDelimiter.js';
const NAMES = { '\t': 'таблица (TSV)', ';': 'таблица (CSV, «;»)', ',': 'таблица (CSV)', '|': 'таблица («|»)' };
/** Человеческое название текстового формата для экрана импорта. */
export default function formatOf(text) {
  if (/^#separator:/m.test(text)) return 'Anki (текстовый экспорт)';
  return NAMES[detectDelimiter(text.split(/\r?\n/).filter(l => !l.startsWith('#')).join('\n'))] ?? 'список «слово — перевод»';
}
