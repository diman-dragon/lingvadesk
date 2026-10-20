import splitDelimited from './splitDelimited.js';
import detectDelimiter from './detectDelimiter.js';
import splitWordList from './splitWordList.js';
const NAMED = { tab: '\t', comma: ',', semicolon: ';', pipe: '|', space: ' ' };
/**
 * Любой текст с таблицей → строки ячеек. Понимает CSV / TSV / «;» / «|», текстовый экспорт Anki (строки «#separator:tab», «#html:true»),
 * экспорт Quizlet и списки «слово — перевод».
 */
export default function parseTextRows(text) {
  const body = text.replace(/^\uFEFF/, '');
  const head = /^#separator:(\w+)/m.exec(body)?.[1];
  const data = body.split(/\r?\n/).filter(l => !l.startsWith('#')).join('\n');
  const delim = head ? NAMED[head] ?? ',' : detectDelimiter(data);
  const rows = delim ? splitDelimited(data, delim) : splitWordList(data);
  return rows.length ? rows : splitWordList(data);
}
