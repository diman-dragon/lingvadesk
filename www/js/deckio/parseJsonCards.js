import rowsToCards from './rowsToCards.js';
const KEYS = { front: ['front', 'word', 'term', 'слово', 'question', 'q'], back: ['back', 'translation', 'definition', 'перевод', 'answer', 'a'], example: ['example', 'sentence', 'пример'], example_translation: ['example_translation', 'exampleTr', 'example_tr', 'пример_перевод'] };
const pick = (o, names) => names.map(k => o[k]).find(v => v !== undefined && v !== null) ?? '';
/** Произвольный JSON → карточки: массив объектов (front/back, word/translation, term/definition …), массив пар [слово, перевод] или объект { слово: перевод }. */
export default function parseJsonCards(json) {
  if (Array.isArray(json)) {
    if (json.every(Array.isArray)) return rowsToCards(json.map(r => r.map(String)));
    return rowsToCards(json.filter(o => o && typeof o === 'object').map(o => ['front', 'back', 'example', 'example_translation'].map(k => String(pick(o, KEYS[k])))).map(r => r));
  }
  if (json && typeof json === 'object') return rowsToCards(Object.entries(json).filter(([, v]) => typeof v === 'string').map(([k, v]) => [k, v]));
  return [];
}
