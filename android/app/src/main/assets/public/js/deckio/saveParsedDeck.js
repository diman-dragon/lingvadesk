import findOrCreateCourse from './findOrCreateCourse.js';
import insertDeck from '../repo/insertDeck.js';
import insertCards from '../repo/insertCards.js';
export default async function saveParsedDeck({ language, tts, deck, cards }) {
  const languageId = await findOrCreateCourse(language, tts);
  const deckId = await insertDeck(languageId, deck);
  await insertCards(deckId, cards);
  return { languageId, deckId, count: cards.length };
}
