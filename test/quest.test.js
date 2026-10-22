import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';
import importLibraryFromFile from './helpers/importLibraryFromFile.js';
import { state } from '../www/js/state/appState.js';
import { QUEST } from '../www/js/constants/QUEST.js';
import listCardsInScope from '../www/js/repo/listCardsInScope.js';
import bestScore from '../www/js/repo/bestScore.js';
import newQuest from '../www/js/game/newQuest.js';
import answerQuest from '../www/js/game/answerQuest.js';
import finishQuest from '../www/js/game/finishQuest.js';
import trail from '../www/js/components/trail.js';
import trailPoints from '../www/js/components/trailPoints.js';
import walkHero from '../www/js/dom/walkHero.js';

const bridge = installBridge();
globalThis.document ??= { getElementById: () => null };
test.beforeEach(async () => { bridge.reset(); bridge.io.picked = deckFile(); await importLibraryFromFile(); });
const make = async () => newQuest(await listCardsInScope('all', 'game'), 'all', 1000);

test('квест: маршрут без повторов, этапы чередуют выбор и ввод, последний — ввод', async () => {
  const q = await make();
  assert.equal(q.stages.length, Math.min(QUEST.stages, 8));
  assert.equal(new Set(q.stages.map(s => s.id)).size, q.stages.length);
  q.stages.forEach((s, i) => {
    const choice = i % 2 === 0 && i < q.stages.length - 1;
    assert.equal(s.kind, choice ? 'choice' : 'type');
    if (choice) { assert.equal(new Set(s.options).size, 4); assert.ok(s.options.includes(s.answer)); }
  });
  assert.throws(() => newQuest([{ id: 1, front: 'a', back: 'x' }, { id: 2, front: 'b', back: 'x' }], 'all'), /две карточки/);
});

test('квест: верный ответ — очки, неверный — минус жизнь; повторный ответ на этап игнорируется', async () => {
  const q = await make();
  assert.deepEqual(answerQuest(q, true, 2000), { ok: true, ms: 1000 });
  assert.equal(answerQuest(q, false), null);
  Object.assign(q, { i: 1, result: null });
  answerQuest(q, false);
  assert.deepEqual([q.score, q.lives, q.correct, q.wrong, q.marks], [QUEST.base, QUEST.lives - 1, 1, 1, ['ok', 'bad']]);
});

test('квест: победа даёт бонус за жизни, результат и рекорд — отдельно от «Блица»', async () => {
  const q = await make();
  state.quest = q;
  answerQuest(q, true);
  await finishQuest(1000 + 20000);
  assert.deepEqual([q.won, q.record, q.seconds, q.score], [true, true, 20, QUEST.base + QUEST.lives * QUEST.lifeBonus]);
  assert.equal(await bestScore('quest'), q.score);
  assert.equal(await bestScore(), 0);                              // рекорд «Блица» не затронут
  await finishQuest();                                             // повторно — без второй записи
  const q2 = await make();
  state.quest = q2;
  q2.lives = 0;
  await finishQuest(2000);
  assert.deepEqual([q2.won, q2.score, q2.record], [false, 0, false]);
});

test('тропинка: точки по волне внутри холста, узлы с отметками, герой идёт к следующему узлу', async () => {
  const pts = trailPoints(8);
  assert.equal(pts.length, 9);
  assert.ok(pts.every(([x, y]) => x >= 0 && x <= QUEST.trail.w && y >= 20 && y <= QUEST.trail.h - 8));
  assert.ok(pts.every((p, k) => !k || p[0] > pts[k - 1][0]));
  const q = await make();
  assert.ok(QUEST.heroes.includes(q.hero));
  let html = trail(q);
  assert.equal((html.match(/class="node/g) || []).length, 8);
  assert.match(html, /node boss/);                                          // последний узел — «босс» 🐉
  assert.match(html, /class="node cur"/);                                   // цель — ближайший узел
  assert.match(html, new RegExp(`id="hero"[^>]*translate\\(${pts[0][0]}px,${pts[0][1]}px\\)[^>]*data-to="${pts[0][0]}px,${pts[0][1]}px"`));   // стоит в начале
  answerQuest(q, true);
  q.walking = true;
  html = trail(q);
  assert.match(html, new RegExp(`translate\\(${pts[0][0]}px,${pts[0][1]}px\\)[^>]*data-to="${pts[1][0]}px,${pts[1][1]}px"`));   // нарисован на старом месте, цель — узел 1
  assert.match(html, /class="node ok"/);
  assert.match(html, /class="seg done"/);
  state.quest = q;
  walkHero();
  assert.equal(q.walking, false);                                          // без DOM-элемента — тихо сбрасывает флаг
  const el = { dataset: { to: '5px,6px' }, style: {} };
  const prev = globalThis.document.getElementById;
  globalThis.document.getElementById = id => (id === 'hero' ? el : prev(id));
  try { walkHero(); } finally { globalThis.document.getElementById = prev; }
  assert.equal(el.style.transform, 'translate(5px,6px)');                  // переход CSS запущен
  q.lives = 0; q.over = true; q.won = false;
  assert.match(trail(q), /🐉/);
  q.lives = 1; q.won = true;
  assert.match(trail(q), /🏆/);
});
