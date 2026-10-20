import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';
import importLibraryFromFile from './helpers/importLibraryFromFile.js';
import { state } from '../www/js/state/appState.js';
import { GAME } from '../www/js/constants/GAME.js';
import listCardsInScope from '../www/js/repo/listCardsInScope.js';
import listReviewsSince from '../www/js/repo/listReviewsSince.js';
import bestScore from '../www/js/repo/bestScore.js';
import newGame from '../www/js/game/newGame.js';
import nextQuestion from '../www/js/game/nextQuestion.js';
import answerQuestion from '../www/js/game/answerQuestion.js';
import finishGame from '../www/js/game/finishGame.js';

const bridge = installBridge();
test.beforeEach(async () => { bridge.reset(); bridge.io.picked = deckFile(); await importLibraryFromFile(); });
const make = async () => { const g = newGame(await listCardsInScope('all', 'game'), 'all', 1000); nextQuestion(g, 1000); return g; };
const right = g => g.q.options.indexOf(g.q.answer);
const wrong = g => g.q.options.findIndex(t => t !== g.q.answer);

test('вопрос: 4 разных варианта с ответом, направление любое', async () => {
  const g = await make();
  for (let i = 0; i < 20; i++) {
    nextQuestion(g, 1000);
    assert.equal(g.q.options.length, 4);
    assert.equal(new Set(g.q.options).size, 4);
    assert.ok(g.q.options.includes(g.q.answer));
  }
  assert.throws(() => newGame([{ back: 'a' }], 'all'), /хотя бы две/);
});

test('очки: база × комбо, бонус за скорость, комбо растёт и обрывается ошибкой, жизни', async () => {
  const g = await make();
  assert.equal(answerQuestion(g, right(g), 1000 + 1000).gained, GAME.base * 1 + GAME.fastBonus);   // быстро
  nextQuestion(g, 2000);
  assert.equal(answerQuestion(g, right(g), 2000 + 5000).gained, GAME.base * 2);                    // комбо ×2, медленно
  assert.deepEqual([g.combo, g.score, g.correct], [2, 35, 2]);
  nextQuestion(g, 3000);
  answerQuestion(g, wrong(g), 3500);
  assert.deepEqual([g.combo, g.lives, g.wrong, g.bestCombo], [0, GAME.lives - 1, 1, 2]);
  for (let i = 0; i < 8; i++) { nextQuestion(g, 4000); answerQuestion(g, right(g), 9000); }
  const last = g.score;
  nextQuestion(g, 5000); answerQuestion(g, right(g), 9000);
  assert.equal(g.score - last, GAME.base * GAME.comboMax);                                         // множитель ограничен
});

test('конец игры: результат и рекорд пишутся в базу, история — с режимом game', async () => {
  const g = await make();
  state.game = g;
  answerQuestion(g, right(g), 1500);
  await finishGame(1000 + 30000);
  assert.equal(g.record, true);
  assert.equal(await bestScore(), g.score);
  assert.equal(g.seconds, 30);
  await finishGame();                                                                              // повторно — без второй записи
  const g2 = await make();
  state.game = g2;
  await finishGame(2000);
  assert.equal(g2.record, false);                                                                  // 0 очков — не рекорд
  assert.equal(await bestScore(), g.score);
});

test('значок: уровни по времени суток, метка «позанимались», плагин и ресурсы на месте', () => {
  const J = 'android/app/src/main/java/com/example/lingocards';
  const read = f => readFileSync(f, 'utf8');
  assert.match(read(`${J}/icon/IconLevel.java`), /hour >= 20 \? 3 : hour >= 17 \? 2 : hour >= 12 \? 1 : 0/);
  assert.match(read(`${J}/icon/IconLevel.java`), /studiedToday \|\| !hasCards/);
  assert.match(read(`${J}/icon/IconApply.java`), /DONT_KILL_APP/);
  assert.match(read(`${J}/icon/IconSchedule.java`), /setInexactRepeating/);
  const m = read('android/app/src/main/AndroidManifest.xml');
  for (const i of [0, 1, 2, 3]) assert.match(m, new RegExp(`activity-alias[^>]*android:name="\\.IconL${i}"`));
  assert.match(m, /android:name="\.IconL0"[^>]*android:enabled="true"/);
  assert.match(m, /android:name="\.IconL3"[^>]*android:enabled="false"/);
  assert.match(m, /RECEIVE_BOOT_COMPLETED/);
  for (const n of [1, 2, 3]) for (const f of [`mipmap-anydpi-v26/ic_launcher_l${n}.xml`, `mipmap-xxhdpi/ic_launcher_l${n}.png`, `drawable/ic_launcher_background_l${n}.xml`]) readFileSync(`android/app/src/main/res/${f}`);
  assert.match(read(`${J}/PluginList.java`), /IconLevelPlugin\.class/);
  assert.match(read(`${J}/PluginList.java`), /AnkiNotesPlugin\.class/);
});
