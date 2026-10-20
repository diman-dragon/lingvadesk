import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import makeZip from './helpers/makeZip.js';
import readImportFile from '../www/js/deckio/readImportFile.js';
import readImportText from '../www/js/deckio/readImportText.js';
import splitDelimited from '../www/js/deckio/splitDelimited.js';
import stripHtml from '../www/js/deckio/stripHtml.js';
import guessTts from '../www/js/deckio/guessTts.js';
import bytesB64 from '../www/js/util/bytesB64.js';

const bridge = installBridge();
const file = (name, content) => ({ name, data: bytesB64(Buffer.isBuffer(content) ? content : Buffer.from(content)) });
const pairs = r => r.cards.map(c => [c.front, c.back]);

test('текстовые форматы: слово — перевод, CSV, TSV, «;», «|», Quizlet', () => {
  const dash = readImportText('w.txt', 'apple — яблоко\ndog - собака\ncat : кошка\nbird\tптица');
  assert.deepEqual(pairs(dash), [['apple', 'яблоко'], ['dog', 'собака'], ['cat', 'кошка'], ['bird', 'птица']]);
  assert.equal(dash.format, 'список «слово — перевод»');
  const csv = readImportText('w.csv', 'word,translation,example\n"hello, world",привет мир,"Say ""hi"""\nbye,пока,');
  assert.deepEqual(csv.cards.map(c => [c.front, c.back, c.example]), [['hello, world', 'привет мир', 'Say "hi"'], ['bye', 'пока', '']]);
  assert.equal(csv.name, 'w');
  assert.deepEqual(pairs(readImportText('a.csv', 'a;б\nc;д')), [['a', 'б'], ['c', 'д']]);
  assert.deepEqual(pairs(readImportText('a.txt', 'one | один\ntwo | два')), [['one', 'один'], ['two', 'два']]);
  assert.deepEqual(pairs(readImportText('q.txt', 'term\tdefinition\nsun\tсолнце')), [['sun', 'солнце']]);   // заголовок распознан
});

test('Anki (текстовый экспорт): служебные строки, HTML, звук, теги', () => {
  const anki = '#separator:tab\n#html:true\n#tags column:3\n<b>apple</b>[sound:a.mp3]\tяблоко<br>плод\ttag1\n';
  const r = readImportText('Deck.txt', anki);
  assert.equal(r.format, 'Anki (текстовый экспорт)');
  assert.deepEqual(pairs(r), [['apple', 'яблоко плод']]);
  assert.equal(stripHtml('a&nbsp;&amp;&lt;b&gt;<i>x</i>'), 'a &<b>x');
});

test('JSON: наш формат, массив объектов, пары, словарь', () => {
  const lib = readImportText('x.json', JSON.stringify({ format: 'lingvadesk-library', version: 1, projects: [{ name: 'P', tts: 'en-US', decks: [{ name: 'D', cards: [{ front: 'a', back: 'б' }] }] }] }));
  assert.equal(lib.kind, 'library');
  assert.deepEqual(pairs(readImportText('x.json', JSON.stringify([{ word: 'a', translation: 'б' }, { term: 'c', definition: 'д', example: 'e' }]))), [['a', 'б'], ['c', 'д']]);
  assert.deepEqual(pairs(readImportText('x.json', JSON.stringify([['a', 'б'], ['c', 'д']]))), [['a', 'б'], ['c', 'д']]);
  assert.deepEqual(pairs(readImportText('x.json', JSON.stringify({ a: 'б', c: 'д' }))), [['a', 'б'], ['c', 'д']]);
  assert.throws(() => readImportText('x.txt', 'просто текст без структуры'), /Не нашёл карточек/);
});

test('кодировки: UTF-8 с BOM, UTF-16, windows-1251', async () => {
  const text = 'слово;перевод\nhouse;дом';
  const utf8 = await readImportFile(file('a.csv', Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(text)])));
  assert.deepEqual(pairs(utf8), [['house', 'дом']]);                           // первая строка — заголовок
  const u16 = await readImportFile(file('a.txt', Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(text, 'utf16le')])));
  assert.deepEqual(pairs(u16), [['house', 'дом']]);
  const cp = Buffer.from([...'house;дом'].map(ch => (ch === ';' ? 0x3b : ch.charCodeAt(0) < 128 ? ch.charCodeAt(0) : ch.charCodeAt(0) - 0x410 + 0xc0)));
  const win = await readImportFile(file('a.csv', cp));
  assert.deepEqual(pairs(win), [['house', 'дом']]);
});

test('Excel (.xlsx): общие строки, inline-строки, пропуски в строках', async () => {
  const sheet = '<worksheet><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row>' +
    '<row r="2"><c r="A2" t="s"><v>2</v></c><c r="B2" t="inlineStr"><is><t>собака &amp; пёс</t></is></c><c r="D2"><v>7</v></c></row></sheetData></worksheet>';
  const strings = '<sst><si><t>word</t></si><si><t>перевод</t></si><si><t>dog</t></si></sst>';
  const xlsx = makeZip({ '[Content_Types].xml': '<x/>', 'xl/workbook.xml': '<workbook/>', 'xl/sharedStrings.xml': strings, 'xl/worksheets/sheet1.xml': sheet });
  const r = await readImportFile(file('words.xlsx', xlsx));
  assert.deepEqual([r.format, r.name, pairs(r)], ['Excel (.xlsx)', 'words', [['dog', 'собака & пёс']]]);
});

test('Anki (.apkg): коллекция уходит в нативный плагин, поля → карточки; новая zstd-коллекция — понятная ошибка', async () => {
  bridge.io.notes = [['Front', 'Back'], ['sun', 'солнце'], ['moon<br>', 'луна\u001fignored'.split('\u001f')[0]]];
  const apkg = makeZip({ 'collection.anki21': 'SQLITE', 'collection.anki2': 'stub', media: '{}' });
  const r = await readImportFile(file('deck.apkg', apkg));
  assert.deepEqual([r.format, pairs(r)], ['Anki (.apkg)', [['sun', 'солнце'], ['moon', 'луна']]]);
  await assert.rejects(readImportFile(file('new.apkg', makeZip({ 'collection.anki21b': 'zstd' }))), /новом формате/);
  await assert.rejects(readImportFile(file('x.zip', makeZip({ 'a.txt': 'x' }))), /не поддерживается/);
});

test('разбор таблиц и голос нового проекта', () => {
  assert.deepEqual(splitDelimited('a,"b\nc",d\n\n e,f', ','), [['a', 'b\nc', 'd'], [' e', 'f']]);
  assert.equal(guessTts([{ front: 'apple' }]), 'en-US');
  assert.equal(guessTts([{ front: 'привет' }]), 'ru-RU');
  assert.equal(guessTts([{ front: '日本語のひらがな' }]), 'ja-JP');
});
