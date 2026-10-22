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

const bridge = installBridge();
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
