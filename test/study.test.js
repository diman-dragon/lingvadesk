import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';
import importLibraryFromFile from '../www/js/deckio/importLibraryFromFile.js';
import insertCards from '../www/js/repo/insertCards.js';
import insertDeck from '../www/js/repo/insertDeck.js';
import insertProject from '../www/js/repo/insertProject.js';
import listCardsInScope from '../www/js/repo/listCardsInScope.js';
import getScopeStats from '../www/js/repo/getScopeStats.js';
import listProjects from '../www/js/repo/listProjects.js';
import listAllDecks from '../www/js/repo/listAllDecks.js';
import deleteProject from '../www/js/repo/deleteProject.js';
import validScope from '../www/js/study/validScope.js';
import startSession from '../www/js/study/startSession.js';
import startQuiz from '../www/js/study/startQuiz.js';
import currentCard from '../www/js/study/currentCard.js';
import cyclePos from '../www/js/study/cyclePos.js';
import gradeCard from '../www/js/study/gradeCard.js';
import restartSession from '../www/js/study/restartSession.js';
import isIntro from '../www/js/study/isIntro.js';
import progressOf from '../www/js/study/progressOf.js';

const bridge = installBridge();
let projectId, deckId;

test.beforeEach(async () => {
  bridge.reset();
  bridge.io.picked = deckFile();
  await importLibraryFromFile();
  projectId = (await listProjects())[0].id;
  deckId = (await listAllDecks())[0].id;
});

test('область учёбы: вся библиотека / проект / колода; у карточек есть голос и подписи', async () => {
  const p2 = await insertProject('Даты', 'ru-RU');
  const d2 = await insertDeck(p2, 'XX век');
  await insertCards(d2, [{ front: '1917', back: 'революция' }, { front: '1945', back: 'победа' }]);
  assert.equal((await listCardsInScope('all')).length, 10);
  assert.equal((await listCardsInScope(`p:${projectId}`)).length, 8);
  assert.equal((await listCardsInScope(`d:${d2}`)).length, 2);
  const c = (await listCardsInScope(`d:${d2}`))[0];
  assert.deepEqual([c.tts, c.pname, c.dname], ['ru-RU', 'Даты', 'XX век']);
  const s = await getScopeStats(`p:${projectId}`);
  assert.deepEqual([s.total, s.due, s.fresh, s.mature], [8, 8, 8, 0]);
  await deleteProject(p2);
  assert.equal(validScope(`d:${d2}`, await listProjects(), await listAllDecks()), 'all');
  assert.equal(validScope(`p:${projectId}`, await listProjects(), await listAllDecks()), `p:${projectId}`);
});

test('повторение: листание по кругу в обе стороны', async () => {
  const s = await startSession('all', 'review', 'off');
  assert.equal(s.order.length, 8);
  await cyclePos(s, -1);                               // перед первой — последняя
  assert.equal(s.pos, 7);
  await cyclePos(s, 1);                                // после последней — первая
  assert.equal(s.pos, 0);
  await cyclePos(s, 1); await cyclePos(s, 1);
  assert.equal(s.pos, 2);
});

test('повторение: позиция и порядок сохраняются, «вперемешку» хранится отдельно', async () => {
  const s = await startSession('all', 'review', 'on');
  await cyclePos(s, 1); await cyclePos(s, 1); await cyclePos(s, 1);
  const again = await startSession('all', 'review', 'on');
  assert.deepEqual([again.pos, again.order], [3, s.order]);
  assert.equal((await startSession('all', 'review', 'off')).pos, 0);
});

test('повторение: новые карточки дописываются в конец сохранённого порядка', async () => {
  const s = await startSession('all', 'review', 'on');
  await insertCards(deckId, [{ front: 'new', back: 'новый' }]);
  const again = await startSession('all', 'review', 'on');
  assert.equal(again.order.length, 9);
  assert.deepEqual(again.order.slice(0, 8), s.order);
});

test('интервальное повторение: оценка убирает карточку, «Снова» — в конец и +10 минут', async () => {
  const s = await startSession('all', 'srs', 'off');
  assert.deepEqual([s.order.length, s.total, s.phase], [8, 8, 'quiz']);
  await gradeCard(s, 'good');
  assert.equal(s.order.length, 7);
  const c = currentCard(s), before = Date.now();
  await gradeCard(s, 'again');
  assert.equal(s.order.length, 7);
  assert.equal(s.order.at(-1), c.id);
  assert.ok(c.due >= before + 9.9 * 60000 && c.due <= Date.now() + 10.1 * 60000);
  assert.equal((await startSession('all', 'srs', 'off')).order.length, 6);   // good → завтра, again → через 10 минут
  for (let i = 0; i < 6; i++) await gradeCard(s, 'easy');
  assert.equal(s.order.length, 1);                     // осталась «Снова»
  assert.equal(progressOf(s).text, 'Осталось 1 из 8');
});

test('обучение: знакомство → проверка, фаза и позиция сохраняются; пустая пачка заменяется следующей', async () => {
  const s = await startSession('all', 'learn', 'off');
  assert.deepEqual([s.order.length, s.phase, isIntro(s)], [8, 'intro', true]);
  assert.match(progressOf(s).text, /Знакомство · 1 \/ 8/);
  await cyclePos(s, -1);
  assert.equal(s.pos, 7);                              // знакомство тоже по кругу
  await startQuiz(s);
  assert.deepEqual([s.phase, s.pos, isIntro(s)], ['quiz', 0, false]);
  await cyclePos(s, 1);
  const back = await startSession('all', 'learn', 'off');
  assert.deepEqual([back.phase, back.pos, back.order], ['quiz', 1, s.order]);
  for (let i = 0; i < 8; i++) await gradeCard(back, 'good');
  assert.equal(back.order.length, 0);
  const empty = await startSession('all', 'learn', 'off');
  assert.equal(empty.order.length, 0);                 // новых карточек больше нет
  await insertCards(deckId, [{ front: 'a', back: 'б' }, { front: 'c', back: 'д' }]);
  const more = await startSession('all', 'learn', 'off');
  assert.deepEqual([more.order.length, more.phase, more.pos], [2, 'intro', 0]);
});

test('restart: следующая пачка «Обучения», свежая очередь SRS, новое перемешивание', async () => {
  const s = await startSession('all', 'srs', 'off');
  await gradeCard(s, 'good'); await gradeCard(s, 'good');
  await restartSession(s);
  assert.deepEqual([s.order.length, s.total, s.pos], [6, 6, 0]);
});
