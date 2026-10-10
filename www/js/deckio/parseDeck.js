import { DECK_FORMAT } from '../constants/DECK_FORMAT.js';
import { DECK_VERSION } from '../constants/DECK_VERSION.js';
import { DEFAULT_TTS } from '../constants/DEFAULT_TTS.js';
import clean from '../util/clean.js';
import isValidCard from './isValidCard.js';
import normalizeCard from './normalizeCard.js';
/** deck.json (текст) → { language, tts, deck, cards }. Бросает Error с понятным текстом. */
export default function parseDeck(text) {
  let j;
  try { j = JSON.parse(text); } catch { throw new Error('Файл не является корректным JSON'); }
  if (j.format !== DECK_FORMAT || j.version !== DECK_VERSION) throw new Error(`Неподдерживаемый формат (нужен ${DECK_FORMAT} v${DECK_VERSION})`);
  const language = clean(j.language?.name), deck = clean(j.deck?.name);
  if (!language || !deck || !Array.isArray(j.cards)) throw new Error('Нет language.name, deck.name или cards[]');
  const cards = j.cards.filter(isValidCard).map(normalizeCard);
  if (!cards.length) throw new Error('В колоде нет валидных карточек');
  return { language, tts: j.language.tts || DEFAULT_TTS, deck, cards };
}
