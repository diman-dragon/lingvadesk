import { DEFAULT_TTS } from '../constants/DEFAULT_TTS.js';
import clean from '../util/clean.js';
import isValidCard from './isValidCard.js';
import normalizeCard from './normalizeCard.js';
/** Файл одной колоды (flashcards-deck v1) → библиотека из одного проекта и одной колоды. Ключ language = проект. */
export default function parseDeck(j) {
  const name = clean(j.language?.name ?? j.project?.name), deck = clean(j.deck?.name);
  if (!name || !deck || !Array.isArray(j.cards)) throw new Error('Нет language.name, deck.name или cards[]');
  const cards = j.cards.filter(isValidCard).map(normalizeCard);
  if (!cards.length) throw new Error('В колоде нет валидных карточек');
  return { projects: [{ name, tts: j.language?.tts || DEFAULT_TTS, decks: [{ name: deck, cards }] }] };
}
