import safOpen from '../native/safOpen.js';
import fromB64 from '../util/fromB64.js';
import parseDeck from './parseDeck.js';
import saveParsedDeck from './saveParsedDeck.js';
export default async function importDeckFromFile() {
  const file = await safOpen();
  return saveParsedDeck(parseDeck(fromB64(file.data)));
}
