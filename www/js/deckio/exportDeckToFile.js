import buildDeckJson from './buildDeckJson.js';
import safSave from '../native/safSave.js';
import toB64 from '../util/toB64.js';
export default async function exportDeckToFile(deckId) {
  const json = await buildDeckJson(deckId);
  await safSave(`${json.deck.name}.json`, 'application/json', toB64(JSON.stringify(json, null, 2)));
}
