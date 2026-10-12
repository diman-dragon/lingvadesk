import { DECK_FORMAT } from '../constants/DECK_FORMAT.js';
import { DECK_VERSION } from '../constants/DECK_VERSION.js';
import { LIBRARY_FORMAT } from '../constants/LIBRARY_FORMAT.js';
import parseDeck from './parseDeck.js';
import parseLibrary from './parseLibrary.js';
/** Текст файла → библиотека { projects: [{ name, tts, decks: [{ name, cards }] }] }. Понимает оба формата. */
export default function parseImport(text) {
  let j;
  try { j = JSON.parse(text); } catch { throw new Error('Файл не является корректным JSON'); }
  if (j.version !== DECK_VERSION) throw new Error('Неподдерживаемая версия формата');
  if (j.format === DECK_FORMAT) return parseDeck(j);
  if (j.format === LIBRARY_FORMAT) return parseLibrary(j);
  throw new Error(`Неподдерживаемый формат (нужен ${LIBRARY_FORMAT} или ${DECK_FORMAT})`);
}
