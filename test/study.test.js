import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';
import importLibraryFromFile from '../www/js/deckio/importLibraryFromFile.js';
import insertCards from '../www/js/repo/insertCards.js';
import insertDeck from '../www/js/repo/insertDeck.js';
import insertProject from '../www/js/repo/insertProject.js';
import insertReview from '../www/js/repo/insertReview.js';
import listCardsInScope from '../www/js/repo/listCardsInScope.js';
import listDeckStats from '../www/js/repo/listDeckStats.js';
import listReviewsSince from '../www/js/repo/listReviewsSince.js';
import listProjects from '../www/js/repo/listProjects.js';
import listAllDecks from '../www/js/repo/listAllDecks.js';
import startSession from '../www/js/study/startSession.js';
import currentCard from '../www/js/study/currentCard.js';
import cyclePos from '../www/js/study/cyclePos.js';
import gradeCard from '../www/js/study/gradeCard.js';
import restartSession from '../www/js/study/restartSession.js';
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

test('область учёбы: вся библиотека / проект / колода; у карточек есть голос и подписи; счётчики по каждой колоде', async () => {
  const p2 = await insertProject('Даты', 'ru-RU');
  const d2 = await insertDeck(p2, 'XX век');
  await insertCards(d2, [{ front: '1917', back: 'революция' }, { front: '1945', back: 'победа' }]);
  assert.equal((await listCardsInScope('all')).length, 10);
  assert.equal((await listCardsInScope(`p:${projectId}`)).length, 8);
  assert.equal((await listCardsInScope(`d:${d2}`)).length, 2);
  const c = (await listCardsInScope(`d:${d2}`))[0];
  assert.deepEqual([c.tts, c.pname, c.dname, c.ll], ['ru-RU', 'Даты', 'XX век', 0]);
  const stats = await listDeckStats();
  assert.deepEqual(stats.map(d => [d.name, d.total, d.due, d.fresh, d.mature]), [['Basics', 8, 0, 8, 0], ['XX век', 2, 0, 2, 0]]);   // новые — не «к повторению»
});

test('листание по кругу в обе стороны', async () => {
  const s = await startSession('all', 'srs');
  assert.equal(s.order.length, 8);
  cyclePos(s, -1);                                     // перед первой — последняя
  assert.equal(s.pos, 7);
  cyclePos(s, 1);                                      // после последней — первая
  assert.equal(s.pos, 0);
  cyclePos(s, 1); cyclePos(s, 1);
  assert.equal(s.pos, 2);
});

test('интервальное повторение: оценка убирает карточку, «Снова» вернётся через 4 карточки и +10 минут', async () => {
  const s = await startSession('all', 'srs');
  assert.deepEqual([s.order.length, s.total], [8, 8]);
  await gradeCard(s, 'good');
  assert.equal(s.order.length, 7);
  const c = currentCard(s), before = Date.now();
  await gradeCard(s, 'again');
  assert.equal(s.order.length, 7);
  assert.equal(s.order[4], c.id);                      // через 4 карточки, а не в самый конец
  assert.ok(c.due >= before + 9.9 * 60000 && c.due <= Date.now() + 10.1 * 60000);
  assert.equal((await startSession('all', 'srs')).order.length, 6);   // good → завтра, again → через 10 минут: всё из базы
  for (let i = 0; i < 4; i++) await gradeCard(s, 'easy');
  assert.equal(currentCard(s).id, c.id);               // «Снова» вернулась
  await gradeCard(s, 'good');
  assert.equal(s.order.length, 2);
  assert.equal(progressOf(s).text, 'Осталось 2 из 8');
});

test('новые карточки: дневной лимит считается на каждую колоду отдельно, уже начатые сегодня учитываются', async () => {
  const p2 = await insertProject('Даты', 'ru-RU');
  const d2 = await insertDeck(p2, 'XX век');
  await insertCards(d2, [1, 2, 3, 4].map(n => ({ front: String(n), back: `б${n}` })));
  const per = (perDay, used) => startSession('all', 'srs', { perDay, used, max: 99 });
  const count = (s, id) => s.order.filter(x => s.map.get(x).deck_id === id).length;
  const a = await per(2, {});
  assert.deepEqual([count(a, deckId), count(a, d2)], [2, 2]);
  const b = await per(2, { [deckId]: 1 });
  assert.deepEqual([count(b, deckId), count(b, d2)], [1, 2]);
  const c = await per(5, { [d2]: 5 });
  assert.deepEqual([count(c, deckId), count(c, d2)], [5, 0]);
});

test('«На слух»: давно не слушанные первыми; расписание не двигается, история пишется с режимом', async () => {
  const all = await startSession('all', 'listen');
  assert.equal(all.order.length, 8);
  await insertReview(all.order[0], 'good', {}, 0, 'listen', 1000);
  const s = await startSession('all', 'listen');
  assert.equal(s.order.at(-1), all.order[0]);          // уже слушанная — в конце
  const card = currentCard(s), before = { due: card.due, interval: card.interval, reps: card.reps };
  await gradeCard(s, 'good', { think: 1500, look: 800, plays: 2, hinted: true });
  assert.deepEqual({ due: card.due, interval: card.interval, reps: card.reps }, before);
  const last = (await listReviewsSince(0)).at(-1);
  assert.deepEqual([last.mode, last.grade, last.fresh, last.hinted, last.plays, last.think], ['listen', 'good', 0, 1, 2, 1500]);
  assert.equal((await startSession('all', 'srs')).order.length, 8);   // интервальное повторение «На слух» не затронуто
});

test('restart: очередь и лимиты заново из базы', async () => {
  const s = await startSession('all', 'srs');
  await gradeCard(s, 'good'); await gradeCard(s, 'good');
  await restartSession(s);
  assert.deepEqual([s.order.length, s.total, s.pos, s.log.length], [6, 6, 0, 0]);
});
