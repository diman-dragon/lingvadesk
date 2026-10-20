import stripHtml from './stripHtml.js';
const COLS = {
  front: /^(front|word|term|слово|термин|вопрос|question|english|англ\w*|original|оригинал|expression|фраза|text|текст)$/i,
  back: /^(back|translation|definition|перевод|определение|ответ|answer|russian|русск\w*|meaning|значение)$/i,
  example: /^(example|sentence|пример|предложение|context|контекст)$/i,
  example_translation: /^(example[_ ]?translation|example[_ ]?tr|пример[_ ]?перевод|перевод[_ ]примера|sentence[_ ]?translation)$/i
};
const isHeader = row => row.some(c => Object.values(COLS).some(re => re.test(c.trim())));
/**
 * Таблица → карточки { front, back, example, example_translation }. Если первая строка — заголовок (слово / перевод / пример …),
 * столбцы определяются по названиям; иначе по порядку: слово, перевод, пример, перевод примера. Пустые строки пропускаются, HTML вычищается.
 */
export default function rowsToCards(rows) {
  const head = rows.length && isHeader(rows[0]) ? rows[0] : null;
  const at = head ? Object.fromEntries(Object.entries(COLS).map(([k, re]) => [k, head.findIndex(c => re.test(c.trim()))])) : { front: 0, back: 1, example: 2, example_translation: 3 };
  const cell = (r, k) => (at[k] >= 0 ? stripHtml(r[at[k]]) : '');
  return (head ? rows.slice(1) : rows).map(r => ({ front: cell(r, 'front'), back: cell(r, 'back'), example: cell(r, 'example'), example_translation: cell(r, 'example_translation') }))
    .filter(c => c.front && c.back);
}
