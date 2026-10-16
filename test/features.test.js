import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';
import importLibraryFromFile from '../www/js/deckio/importLibraryFromFile.js';
import { state } from '../www/js/state/appState.js';
import { BEHAVIOR } from '../www/js/constants/BEHAVIOR.js';
import startSession from '../www/js/study/startSession.js';
import gradeCard from '../www/js/study/gradeCard.js';
import undoGrade from '../www/js/study/undoGrade.js';
import leaveCard from '../www/js/study/leaveCard.js';
import trackShow from '../www/js/study/trackShow.js';
import trackFlip from '../www/js/study/trackFlip.js';
import currentCard from '../www/js/study/currentCard.js';
import makeQuiz from '../www/js/study/makeQuiz.js';
import cardDir from '../www/js/study/cardDir.js';
import loadToday from '../www/js/study/loadToday.js';
import dayBars from '../www/js/study/dayBars.js';
import retention from '../www/js/study/retention.js';
import updateCardSrs from '../www/js/repo/updateCardSrs.js';
import insertReview from '../www/js/repo/insertReview.js';
import listRecentReviews from '../www/js/repo/listRecentReviews.js';
import countNewToday from '../www/js/repo/countNewToday.js';
import inferGrade from '../www/js/srs/inferGrade.js';
import calibrate from '../www/js/srs/calibrate.js';
import sameAnswer from '../www/js/util/sameAnswer.js';
import dayStart from '../www/js/util/dayStart.js';

const bridge = installBridge();
const realNow = Date.now;
let t = 1e12;
test.beforeEach(async () => {
  bridge.reset();
  bridge.io.picked = deckFile();
  await importLibraryFromFile();
  t = 1e12;
  Date.now = () => t;
});
test.afterEach(() => { Date.now = realNow; state.prefs.dir = 'fwd'; });

test('отмена оценки возвращает расписание, историю, счётчик дня, очередь и итог сессии', async () => {
  const s = await startSession('all', 'srs', 'off');
  const card = currentCard(s), before = { due: card.due, interval: card.interval, ease: card.ease, reps: card.reps };
  trackShow(s); t += 2000; trackFlip(); t += 2000;
  await leaveCard(s, 1);
  assert.equal(s.order.length, 7);
  assert.equal(s.log.length, 1);
  assert.equal(await countNewToday(dayStart(0, t)), 1);
  await undoGrade(s);
  assert.deepEqual({ due: card.due, interval: card.interval, ease: card.ease, reps: card.reps }, before);
  assert.deepEqual([s.order.length, s.log.length, s.undo, currentCard(s).id], [8, 0, null, card.id]);
  assert.equal(await countNewToday(dayStart(0, t)), 0);
  assert.equal((await loadToday(t)).n, 0);
  assert.equal((await listRecentReviews(10)).length, 0);
});

test('интервальное повторение: просроченные первыми, новые — по дневному лимиту, всё — не больше размера сессии', async () => {
  const all = await startSession('all', 'srs', 'off');
  const dueId = all.order[4];
  await updateCardSrs(dueId, { due: 1000, interval: 1, ease: 2.5, reps: 1 });
  const lim = (newLeft, max) => startSession('all', 'srs', 'off', 'all', { newLeft, max });
  const a = await lim(2, 99);
  assert.equal(a.order.length, 3);
  assert.equal(a.order[0], dueId);
  assert.equal((await lim(0, 99)).order.length, 1);               // лимит новых исчерпан — только просроченные
  assert.equal((await lim(5, 2)).order.length, 2);                // размер сессии
});

test('история: оценка пишет время; новые карточки считаются за день', async () => {
  const s = await startSession('all', 'srs', 'off');
  await gradeCard(s, 'good', { think: 2000, look: 1500 });
  assert.deepEqual((await listRecentReviews(10)).map(r => [r.think, r.look]), [[2000, 1500]]);
  assert.equal(await countNewToday(dayStart(0, t)), 1);
});

test('«пиявка»: пятое «снова» откладывает карточку и убирает из очереди', async () => {
  const s = await startSession('all', 'srs', 'off');
  const card = currentCard(s);
  for (let i = 0; i < BEHAVIOR.leech - 1; i++) await insertReview(card.id, 'again');
  await gradeCard(s, 'again');
  assert.ok(card.due >= t + (BEHAVIOR.leechDays - 0.1) * 86400000);
  assert.ok(!s.order.includes(card.id));
});

test('калибровка: медленному читателю пороги длиннее, быстрому — короче, мало данных — общие', () => {
  const rows = n => Array.from({ length: n }, () => ({ think: 6000, look: 6000 }));
  assert.equal(calibrate(rows(10)), BEHAVIOR);
  const slow = calibrate(rows(40));
  assert.deepEqual(slow.think, [8000, 18000]);
  assert.equal(slow.readAnswer, 6000);
  const fast = calibrate(Array.from({ length: 40 }, () => ({ think: 1000, look: 1000 })));
  assert.equal(fast.think[0], 2400);
});

test('оценка по ответу: верно — по времени, подсказка — трудно, неверно — снова, без ответа — нет', () => {
  const g = o => inferGrade({ think: 2000, look: 0, dwell: 3000, flips: 0, revisit: false, away: false, kind: 'choice', correct: true, hinted: false, ...o }, { reps: 0 });
  assert.equal(g({}), 'easy');
  assert.equal(g({ think: 5000 }), 'good');
  assert.equal(g({ think: 10000 }), 'hard');
  assert.equal(g({ hinted: true }), 'hard');
  assert.equal(g({ correct: false }), 'again');
  assert.equal(g({ correct: null }), null);
  assert.equal(g({ kind: 'type', think: 8000 }), 'easy');         // ввод занимает дольше
  assert.equal(g({ think: 300, dwell: 400 }), 'easy');            // быстрый верный ответ не отбрасывается как «мелькнуло»
});

test('ввод ответа: регистр, пунктуация, ё/е, диакритика, варианты через запятую', () => {
  assert.ok(sameAnswer('  ЯБЛОКО. ', 'яблоко'));
  assert.ok(sameAnswer('елка', 'ёлка'));
  assert.ok(sameAnswer('cafe', 'café'));
  assert.ok(sameAnswer('плод', 'яблоко, плод / фрукт'));
  assert.ok(!sameAnswer('груша', 'яблоко'));
  assert.ok(!sameAnswer('', 'яблоко'));
  assert.ok(!sameAnswer('й', 'и'));                               // кириллическая «й» не сводится к «и»
});

test('вопросы: выбор — 4 разных варианта с ответом; ввод; переворот — без вопроса', async () => {
  const s = await startSession('all', 'srs', 'off');
  const card = currentCard(s);
  const c = makeQuiz(s, card, 'fwd', 'choice');
  assert.equal(c.kind, 'choice');
  assert.equal(c.options.length, 4);
  assert.equal(new Set(c.options).size, 4);
  assert.ok(c.options.includes(card.back));
  assert.equal(makeQuiz(s, card, 'rev', 'choice').answer, card.front);
  assert.equal(makeQuiz(s, card, 'fwd', 'type').kind, 'type');
  assert.equal(makeQuiz(s, card, 'fwd', 'flip'), null);
  const r = await startSession('d:1', 'review', 'off');
  assert.equal(makeQuiz(r, currentCard(r), 'fwd', 'choice'), null);   // случайная колода — просто карточки
});

test('направление «вперемешку»: у карточки оно случайное, но стабильное в сессии', async () => {
  state.prefs.dir = 'mix';
  const s = await startSession('all', 'srs', 'off');
  const seen = new Set();
  for (const id of s.order) {
    const card = s.map.get(id), d = cardDir(s, card);
    assert.ok(d === 'fwd' || d === 'rev');
    assert.equal(cardDir(s, card), d);
    seen.add(d);
  }
  state.prefs.dir = 'rev';
  assert.equal(cardDir(s, currentCard(s)), 'rev');
});

test('статистика: столбики по дням и удержание', () => {
  const now = new Date(2026, 2, 10, 12).getTime(), day = 86400000;
  const rows = [{ ts: now, grade: 'good', fresh: 0 }, { ts: now - 1000, grade: 'again', fresh: 0 }, { ts: now - day, grade: 'easy', fresh: 1 }, { ts: now - 40 * day, grade: 'good', fresh: 0 }];
  const bars = dayBars(rows, 14, now);
  assert.equal(bars.length, 14);
  assert.deepEqual([bars.at(-1).n, bars.at(-2).n, bars.at(-1).today, bars.at(-1).label], [2, 1, true, '10']);
  assert.equal(bars.reduce((a, b) => a + b.n, 0), 3);             // старое за окном не считается
  assert.equal(retention(rows), 67);                              // изученных 3: без «снова» — 2
  assert.equal(retention([{ ts: now, grade: 'good', fresh: 1 }]), null);
});
