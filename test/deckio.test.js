import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';
import parseDeck from '../www/js/deckio/parseDeck.js';
import importDeckFromFile from '../www/js/deckio/importDeckFromFile.js';
import exportDeckToFile from '../www/js/deckio/exportDeckToFile.js';
import fromB64 from '../www/js/util/fromB64.js';

const bridge = installBridge();
test.beforeEach(() => bridge.reset());

test('parseDeck отклоняет неверный JSON, формат и пустые колоды', () => {
  assert.throws(() => parseDeck('{'), /JSON/);
  assert.throws(() => parseDeck('{"format":"x"}'), /формат/);
  const base = { format: 'flashcards-deck', version: 1, language: { name: 'EN' }, deck: { name: 'D' } };
  assert.throws(() => parseDeck(JSON.stringify({ ...base })), /cards/);
  assert.throws(() => parseDeck(JSON.stringify({ ...base, cards: [{ front: ' ', back: 'x' }] })), /валидных/);
});

test('импорт создаёт язык → колоду → карточки; повторный импорт переиспользует язык', async () => {
  bridge.io.picked = deckFile();
  const a = await importDeckFromFile();
  const b = await importDeckFromFile();
  assert.equal(a.count, 8);
  assert.equal(a.languageId, b.languageId);
  assert.notEqual(a.deckId, b.deckId);
});

test('экспорт → импорт сохраняет карточки (круговой тест)', async () => {
  bridge.io.picked = deckFile();
  const { deckId } = await importDeckFromFile();
  await exportDeckToFile(deckId);
  assert.equal(bridge.io.saved.name, 'Basics.json');
  const out = JSON.parse(fromB64(bridge.io.saved.data));
  const orig = JSON.parse(fromB64(deckFile().data));
  assert.deepEqual(out, orig);
});
