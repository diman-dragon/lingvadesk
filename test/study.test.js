import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';
import importDeckFromFile from '../www/js/deckio/importDeckFromFile.js';
import getDeckWithCourse from '../www/js/repo/getDeckWithCourse.js';
import listCourses from '../www/js/repo/listCourses.js';
import listDecksOfCourse from '../www/js/repo/listDecksOfCourse.js';
import insertCards from '../www/js/repo/insertCards.js';
import deleteCourse from '../www/js/repo/deleteCourse.js';
import startSession from '../www/js/study/startSession.js';
import currentCard from '../www/js/study/currentCard.js';
import movePos from '../www/js/study/movePos.js';
import gradeCard from '../www/js/study/gradeCard.js';

const bridge = installBridge();
let deck, ids;

test.beforeEach(async () => {
  bridge.reset();
  bridge.io.picked = deckFile();
  ids = await importDeckFromFile();
  deck = await getDeckWithCourse(ids.deckId);
});

test('seq: позиция сохраняется и восстанавливается', async () => {
  const s = await startSession(deck, 'seq');
  await movePos(s, 4);
  const again = await startSession(deck, 'seq');
  assert.equal(again.pos, 4);
  assert.deepEqual(again.order, s.order);
});

test('shuffle: порядок и позиция переживают «перезапуск»', async () => {
  const s = await startSession(deck, 'shuffle');
  await movePos(s, 3);
  const again = await startSession(deck, 'shuffle');
  assert.deepEqual(again.order, s.order);
  assert.equal(again.pos, 3);
});

test('режимы хранят позиции независимо', async () => {
  const seq = await startSession(deck, 'seq');
  await movePos(seq, 2);
  assert.equal((await startSession(deck, 'shuffle')).pos, 0);
});

test('новые карточки дописываются в конец сохранённого порядка', async () => {
  const s = await startSession(deck, 'shuffle');
  await insertCards(deck.id, [{ front: 'new', back: 'новый' }], 8);
  const again = await startSession(deck, 'shuffle');
  assert.equal(again.order.length, s.order.length + 1);
  assert.deepEqual(again.order.slice(0, s.order.length), s.order);
});

test('srs: good убирает карточку из очереди, again возвращает в конец и назначает +10 мин', async () => {
  const s = await startSession(deck, 'srs');
  assert.equal(s.order.length, 8);
  await gradeCard(s, 'good');
  assert.equal(s.order.length, 8);
  const c = currentCard(s);
  const before = Date.now();
  await gradeCard(s, 'again');
  assert.equal(s.order.length, 9);
  assert.equal(s.order.at(-1), c.id);
  assert.ok(c.due >= before + 9.9 * 60000 && c.due <= Date.now() + 10.1 * 60000);
  const next = await startSession(deck, 'srs');
  assert.equal(next.order.length, 6); // обе оценённые карточки ушли: good — на завтра, again — через 10 минут
});

test('счётчики «к повторению» и каскадное удаление языка', async () => {
  const [lang] = await listCourses();
  assert.equal(lang.due, 8);
  const [d] = await listDecksOfCourse(ids.languageId);
  assert.deepEqual([d.n, d.due], [8, 8]);
  await deleteCourse(ids.languageId);
  assert.equal((await listCourses()).length, 0);
});

test('learn: пачка = знакомство + проверка, позиция и фаза переживают перезапуск', async () => {
  const s = await startSession(deck, 'learn');
  assert.equal(s.order.length, 16);
  assert.equal(s.intro, 8);
  assert.deepEqual(s.order.slice(0, 8), s.order.slice(8));
  await movePos(s, 3);
  const again = await startSession(deck, 'learn');
  assert.deepEqual([again.pos, again.intro], [3, 8]);
  assert.deepEqual(again.order, s.order);
});

test('learn: после оценки карточка перестаёт быть новой; завершённая пачка заменяется следующей', async () => {
  const s = await startSession(deck, 'learn');
  await movePos(s, 8);                       // пропустить знакомство
  for (let i = 0; i < 8; i++) await gradeCard(s, 'good');
  assert.equal(s.pos, 16);
  const next = await startSession(deck, 'learn');
  assert.equal(next.order.length, 0);        // новых слов больше нет
  await insertCards(deck.id, [{ front: 'a', back: 'б' }, { front: 'c', back: 'д' }], 8);
  const more = await startSession(deck, 'learn');
  assert.deepEqual([more.order.length, more.intro, more.pos], [4, 2, 0]);
});

test('learn: «Снова» в проверке возвращает карточку в конец пачки', async () => {
  const s = await startSession(deck, 'learn');
  await movePos(s, 8);
  const id = currentCard(s).id;
  await gradeCard(s, 'again');
  assert.equal(s.order.length, 17);
  assert.equal(s.order.at(-1), id);
});
