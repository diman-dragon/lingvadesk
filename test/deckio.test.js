import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';
import parseImport from '../www/js/deckio/parseImport.js';
import parseLibrary from '../www/js/deckio/parseLibrary.js';
import importLibraryFromFile from '../www/js/deckio/importLibraryFromFile.js';
import exportLibraryToFile from '../www/js/deckio/exportLibraryToFile.js';
import buildLibraryJson from '../www/js/deckio/buildLibraryJson.js';
import insertProject from '../www/js/repo/insertProject.js';
import insertDeck from '../www/js/repo/insertDeck.js';
import insertCards from '../www/js/repo/insertCards.js';
import listAllDecks from '../www/js/repo/listAllDecks.js';
import fromB64 from '../www/js/util/fromB64.js';

const bridge = installBridge();
test.beforeEach(() => bridge.reset());
const deck = { format: 'flashcards-deck', version: 1, language: { name: 'EN' }, deck: { name: 'D' } };

test('parseImport: понятные ошибки', () => {
  assert.throws(() => parseImport('{'), /JSON/);
  assert.throws(() => parseImport('{"format":"x","version":1}'), /формат/);
  assert.throws(() => parseImport('{"format":"flashcards-deck","version":2}'), /верси/);
  assert.throws(() => parseImport(JSON.stringify(deck)), /cards/);
  assert.throws(() => parseImport(JSON.stringify({ ...deck, cards: [{ front: ' ', back: 'x' }] })), /валидных/);
  assert.throws(() => parseLibrary({ projects: [] }), /projects/);
  assert.throws(() => parseLibrary({ projects: [{ name: 'P' }] }), /decks/);
  assert.throws(() => parseLibrary({ projects: [{ name: 'P', decks: [{ cards: [] }] }] }), /name или cards/);
});

test('импорт одной колоды: проект → колода → карточки; повторный импорт ничего не дублирует', async () => {
  bridge.io.picked = deckFile();
  assert.deepEqual(await importLibraryFromFile(), { projects: 1, decks: 1, added: 8 });
  assert.deepEqual(await importLibraryFromFile(), { projects: 1, decks: 1, added: 0 });
  assert.equal((await listAllDecks()).length, 1);
});

test('экспорт и импорт всей библиотеки: круговой тест', async () => {
  bridge.io.picked = deckFile();
  await importLibraryFromFile();
  const p2 = await insertProject('Даты', 'ru-RU');
  const d2 = await insertDeck(p2, 'XX век');
  await insertCards(d2, [{ front: '1917', back: 'революция', example: 'Год 1917', exampleTr: 'пример' }]);
  assert.equal(await exportLibraryToFile(), 2);
  assert.match(bridge.io.saved.name, /^lingvadesk-library-\d{8}-\d{4}\.json$/);
  const exported = JSON.parse(fromB64(bridge.io.saved.data));
  assert.equal(exported.format, 'lingvadesk-library');
  assert.deepEqual(exported.projects.map(p => [p.name, p.decks.length]), [['English', 1], ['Даты', 1]]);
  bridge.reset();
  bridge.io.picked = bridge.io.saved;
  assert.deepEqual(await importLibraryFromFile(), { projects: 2, decks: 2, added: 9 });
  assert.deepEqual(await buildLibraryJson(), exported);
});

test('примеры из examples/ корректны: deck.json и library.json', async () => {
  const { readFileSync } = await import('node:fs');
  const one = parseImport(readFileSync('examples/deck.json', 'utf8'));
  assert.equal(one.projects[0].decks[0].cards.length, 8);
  const lib = parseImport(readFileSync('examples/library.json', 'utf8'));
  assert.deepEqual(lib.projects.map(p => p.decks.map(d => d.cards.length)), [[20, 5], [4]]);
});
