import { DECK_FORMAT } from '../constants/DECK_FORMAT.js';
import { DECK_VERSION } from '../constants/DECK_VERSION.js';
import getDeckWithCourse from '../repo/getDeckWithCourse.js';
import listCards from '../repo/listCards.js';
export default async function buildDeckJson(deckId) {
  const [d, cards] = await Promise.all([getDeckWithCourse(deckId), listCards(deckId)]);
  return {
    format: DECK_FORMAT, version: DECK_VERSION,
    language: { name: d.cname, tts: d.tts },
    deck: { name: d.name },
    cards: cards.map(c => ({
      front: c.front, back: c.back,
      ...(c.example && { example: c.example }),
      ...(c.example_tr && { example_translation: c.example_tr })
    }))
  };
}
