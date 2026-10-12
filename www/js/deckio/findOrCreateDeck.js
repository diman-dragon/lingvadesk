import findDeckByName from '../repo/findDeckByName.js';
import insertDeck from '../repo/insertDeck.js';
export default async function findOrCreateDeck(projectId, name) {
  return (await findDeckByName(projectId, name))?.id ?? insertDeck(projectId, name);
}
