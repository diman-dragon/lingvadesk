import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';
import importLibraryFromFile from '../www/js/deckio/importLibraryFromFile.js';
import saveLibrary from '../www/js/deckio/saveLibrary.js';
import parseImport from '../www/js/deckio/parseImport.js';
import insertProject from '../www/js/repo/insertProject.js';
import insertDeck from '../www/js/repo/insertDeck.js';
import insertCards from '../www/js/repo/insertCards.js';
import listAllDecks from '../www/js/repo/listAllDecks.js';
import inferGrade from '../www/js/srs/inferGrade.js';
import trackShow from '../www/js/study/trackShow.js';
import trackFlip from '../www/js/study/trackFlip.js';
import trackSignals from '../www/js/study/trackSignals.js';
import trackPause from '../www/js/study/trackPause.js';
import trackResume from '../www/js/study/trackResume.js';
import leaveCard from '../www/js/study/leaveCard.js';
import startSession from '../www/js/study/startSession.js';
import gradeCard from '../www/js/study/gradeCard.js';
import currentCard from '../www/js/study/currentCard.js';
import randomCandidates from '../www/js/study/randomCandidates.js';
import pickDeck from '../www/js/study/pickDeck.js';
import restartSession from '../www/js/study/restartSession.js';
import loadToday from '../www/js/study/loadToday.js';
import countToday from '../www/js/study/countToday.js';
import dayKey from '../www/js/util/dayKey.js';

const bridge = installBridge();
const realNow = Date.now;
let t = 1e12;
const tick = ms => { t += ms; };

test.beforeEach(async () => {
  bridge.reset();
  bridge.io.picked = deckFile();
  await importLibraryFromFile();
  t = 1e12;
  Date.now = () => t;
});
test.afterEach(() => { Date.now = realNow; });

const sig = o => ({ think: null, look: 0, dwell: 0, flips: 0, revisit: false, away: false, ...o });
const fresh = { reps: 0 }, known = { reps: 3 };

test('оценка по поведению: просто пролистал или отвлёкся — расписание не трогаем', () => {
  assert.equal(inferGrade(sig({ dwell: 800 }), fresh), null);
  assert.equal(inferGrade(sig({ think: 600, look: 400, dwell: 1000, flips: 1 }), fresh), null);
  assert.equal(inferGrade(sig({ think: 2000, look: 2000, dwell: 4000, flips: 1, away: true }), fresh), null);
});

test('оценка по поведению: без переворота — знает; зрелая и быстро — легко; долго мялся — трудно', () => {
  assert.equal(inferGrade(sig({ dwell: 2500 }), fresh), 'good');
  assert.equal(inferGrade(sig({ dwell: 2500 }), known), 'easy');
  assert.equal(inferGrade(sig({ dwell: 6000 }), known), 'good');
  assert.equal(inferGrade(sig({ dwell: 10000 }), known), 'hard');
});

test('оценка по поведению: вспоминал, читал ответ, метался, возвращался', () => {
  const g = o => inferGrade(sig({ flips: 1, ...o }), fresh);
  assert.equal(g({ think: 2000, look: 2000, dwell: 4000 }), 'easy');             // вспомнил быстро, ответ глянул
  assert.equal(g({ think: 1000, look: 1000, dwell: 2000 }), 'good');             // перевернул рефлекторно — не «легко»
  assert.equal(g({ think: 3500, look: 2000, dwell: 5500 }), 'good');
  assert.equal(g({ think: 5000, look: 2000, dwell: 7000 }), 'good');             // чуть подумал
  assert.equal(g({ think: 5000, look: 6000, dwell: 11000 }), 'hard');            // думал и долго читал
  assert.equal(g({ think: 10000, look: 2000, dwell: 12000 }), 'hard');
  assert.equal(g({ think: 10000, look: 6000, dwell: 16000 }), 'again');          // мучился и учил ответ
  assert.equal(g({ think: 2000, look: 2000, dwell: 4000, flips: 4 }), 'good');   // метался туда-обратно
  assert.equal(g({ think: 2000, look: 2000, dwell: 4000, flips: 4, revisit: true }), 'hard');
  assert.equal(g({ think: 1000, look: 4000, dwell: 5000, revisit: true }), 'hard');   // не вспоминал, читал, вернулся
});

test('трекер: время до переворота и на ответе, переворот туда-обратно, пауза, «отвлёкся»', async () => {
  const s = await startSession('all', 'srs', 'off');
  trackShow(s); tick(2500); trackFlip(); tick(3500);
  let x = trackSignals();
  assert.deepEqual([x.think, x.look, x.dwell, x.flips, x.revisit, x.away], [2500, 3500, 6000, 1, false, false]);
  trackShow(s, true); tick(1000); trackFlip(); tick(1000); trackFlip(); tick(1000); trackFlip();
  x = trackSignals();
  assert.deepEqual([x.think, x.look, x.dwell, x.flips, x.revisit], [1000, 1000, 3000, 3, true]);
  trackShow(s); tick(1000); trackPause(); tick(60000); trackResume(); tick(1000);   // свернули на минуту
  x = trackSignals();
  assert.deepEqual([x.dwell, x.away], [2000, false]);
  trackShow(s); tick(50000);                                                     // положил телефон
  assert.equal(trackSignals().away, true);
});

test('уход с карточки: вперёд — оценка по поведению, назад / случайная колода / знакомство — без оценки', async () => {
  const s = await startSession('all', 'srs', 'off');
  trackShow(s);
  const a = currentCard(s);
  tick(2000); trackFlip(); tick(2000);
  await leaveCard(s, 1);                                // вспомнил за 2 с, ответ глянул 2 с → легко
  assert.equal(s.order.length, 7);
  assert.deepEqual([a.interval, a.reps], [4, 1]);
  trackShow(s);
  const b = currentCard(s);
  tick(2000); trackFlip(); tick(2000);
  await leaveCard(s, -1);                               // назад — не оцениваем
  assert.deepEqual([s.order.length, b.reps, b.due], [7, 0, 0]);
  trackShow(s); tick(300);
  await leaveCard(s, 1);                                // мелькнула — не оцениваем
  assert.equal(s.order.length, 7);
  assert.equal((await loadToday(t)).n, 1);              // в счётчик дня попала одна карточка

  const deck = (await listAllDecks())[0].id;
  const r = await startSession(`d:${deck}`, 'review', 'off');
  trackShow(r); tick(2000); trackFlip(); tick(2000);
  const c = currentCard(r), due = c.due;
  await leaveCard(r, 1);
  assert.deepEqual([r.order.length, r.pos, c.due], [8, 1, due]);   // расписание не изменилось

  const l = await startSession('all', 'learn', 'off');  // знакомство
  const first = currentCard(l), was = first.due;
  trackShow(l); tick(2000); trackFlip(); tick(2000);
  await leaveCard(l, 1);
  assert.deepEqual([l.pos, first.due], [1, was]);
});

test('случайная колода: из проекта — непустая и другая; колода — она сама; вся библиотека — нельзя', async () => {
  const p = await insertProject('Даты', 'ru-RU');
  const d1 = await insertDeck(p, 'A'), d2 = await insertDeck(p, 'B'), d3 = await insertDeck(p, 'Пустая');
  await insertCards(d1, [{ front: '1', back: 'a' }]);
  await insertCards(d2, [{ front: '2', back: 'b' }, { front: '3', back: 'c' }]);
  assert.deepEqual((await randomCandidates(`p:${p}`)).sort(), [d1, d2].sort());
  assert.deepEqual(await randomCandidates(`d:${d3}`), []);
  assert.equal(await pickDeck('all'), null);
  assert.equal(await pickDeck(`d:${d3}`), null);
  assert.equal(await pickDeck(`d:${d1}`), `d:${d1}`);
  for (let i = 0; i < 20; i++) assert.equal(await pickDeck(`p:${p}`, `d:${d1}`), `d:${d2}`);   // есть выбор — не та же
  const seen = new Set();
  for (let i = 0; i < 40; i++) seen.add(await pickDeck(`p:${p}`));
  assert.deepEqual([...seen].sort(), [`d:${d1}`, `d:${d2}`]);                                  // выпадают обе

  const s = await startSession(await pickDeck(`p:${p}`), 'review', 'off', `p:${p}`);
  const was = s.scope;
  await restartSession(s);                              // 🎲 — другая колода проекта
  assert.notEqual(s.scope, was);
  assert.deepEqual([s.origin, s.mode], [`p:${p}`, 'review']);
  assert.equal(s.order.length, s.scope === `d:${d1}` ? 1 : 2);
  const only = await startSession(`d:${d1}`, 'review', 'off', `d:${d1}`);
  await restartSession(only);
  assert.equal(only.scope, `d:${d1}`);
});

test('счётчик дня и серия подряд', async () => {
  const at = (m, d, h = 12) => new Date(2026, m - 1, d, h).getTime();
  assert.equal(dayKey(0, at(3, 5)), '2026-03-05');
  assert.equal(dayKey(-1, at(3, 1)), '2026-02-28');
  assert.deepEqual(await loadToday(at(3, 5)), { day: '2026-03-05', n: 0, streak: 0, last: '' });
  await countToday(at(3, 5)); await countToday(at(3, 5, 18));
  let x = await loadToday(at(3, 5, 20));
  assert.deepEqual([x.n, x.streak], [2, 1]);
  await countToday(at(3, 6));
  x = await loadToday(at(3, 6));
  assert.deepEqual([x.n, x.streak], [1, 2]);            // новый день, серия растёт
  x = await loadToday(at(3, 7));
  assert.deepEqual([x.n, x.streak], [0, 2]);            // вчера учился — серия жива
  x = await loadToday(at(3, 9));
  assert.deepEqual([x.n, x.streak], [0, 0]);            // пропуск — серия прервалась
  await countToday(at(3, 9));
  assert.equal((await loadToday(at(3, 9))).streak, 1);
});

test('оценка карточки попадает в счётчик дня', async () => {
  const s = await startSession('all', 'srs', 'off');
  await gradeCard(s, 'good'); await gradeCard(s, 'again');
  assert.equal((await loadToday(t)).n, 2);
});

test('импорт: null и не-объект — понятная ошибка, повторы внутри файла не дублируются', async () => {
  assert.throws(() => parseImport('null'), /не похож/);
  assert.throws(() => parseImport('42'), /не похож/);
  const r = await saveLibrary({ projects: [{ name: 'X', tts: 'en-US', decks: [{ name: 'D', cards: [{ front: 'a', back: 'b' }, { front: 'a', back: 'b' }, { front: 'c', back: 'd' }] }] }] });
  assert.equal(r.added, 2);
});
