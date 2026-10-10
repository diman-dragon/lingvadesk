import { readFileSync } from 'node:fs';
/** examples/deck.json в виде ответа SafOpen. */
export default function deckFile(path = 'examples/deck.json') {
  return { name: 'deck.json', data: Buffer.from(readFileSync(path)).toString('base64') };
}
