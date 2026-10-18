import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';
import importLibraryFromFile from '../www/js/deckio/importLibraryFromFile.js';
import startSession from '../www/js/study/startSession.js';
import scoreSpeech from '../www/js/study/scoreSpeech.js';
import levenshtein from '../www/js/util/levenshtein.js';
import speechGrade from '../www/js/srs/speechGrade.js';
import inferGrade from '../www/js/srs/inferGrade.js';
import insertPronunciation from '../www/js/repo/insertPronunciation.js';
import listPronunciationsSince from '../www/js/repo/listPronunciationsSince.js';
import listWeakWords from '../www/js/repo/listWeakWords.js';
import resetProgress from '../www/js/repo/resetProgress.js';

const bridge = installBridge();
const J = 'android/app/src/main/java/com/example/lingocards';

test('расстояние Левенштейна', () => {
  assert.equal(levenshtein('kitten', 'sitting'), 3);
  assert.equal(levenshtein('', 'abc'), 3);
  assert.equal(levenshtein('same', 'same'), 0);
});

test('оценка произношения: сходство с текстом, лучший вариант, уверенность, фразы', () => {
  assert.equal(scoreSpeech({ text: 'apple' }, 'apple'), 1);
  assert.equal(scoreSpeech({ text: 'Apple!' }, 'apple'), 1);                       // регистр и пунктуация не важны
  assert.equal(scoreSpeech({ text: 'aple' }, 'apple'), 0.8);
  assert.equal(scoreSpeech({ text: 'aple', alternatives: ['apple'] }, 'apple'), 1); // лучший из вариантов распознавания
  assert.equal(scoreSpeech({ text: 'apple', confidence: 0.6 }, 'apple'), 0.94);
  assert.equal(scoreSpeech({ text: 'apple', confidence: -1 }, 'apple'), 1);        // уверенность неизвестна — не штрафуем
  assert.equal(scoreSpeech({ text: 'apple', confidence: 0 }, 'apple'), 1);
  assert.equal(scoreSpeech({ text: '' }, 'apple'), 0);
  assert.equal(scoreSpeech({ text: 'banana' }, 'apple') < 0.3, true);
  assert.equal(scoreSpeech({ text: 'where is the station' }, 'Where is the station?'), 1);
  assert.ok(scoreSpeech({ text: 'where the station' }, 'Where is the station?') > 0.7);   // пропущено слово — оценка ниже, но не ноль
});

test('оценка карточки по произношению: границы, попытки, подсказка', () => {
  assert.equal(speechGrade(0.95, 1, false), 'easy');
  assert.equal(speechGrade(0.95, 2, false), 'good');            // не с первой попытки
  assert.equal(speechGrade(0.95, 1, true), 'good');             // с подсказкой — на ступень ниже
  assert.equal(speechGrade(0.8, 1, true), 'hard');
  assert.equal(speechGrade(0.8, 1, false), 'good');
  assert.equal(speechGrade(0.6, 1, false), 'hard');
  assert.equal(speechGrade(0.6, 1, true), 'hard');
  assert.equal(speechGrade(0.3, 1, false), 'again');
  const sig = o => ({ speak: true, score: 0.95, attempts: 1, hinted: false, dwell: 3000, think: null, away: false, ...o });
  assert.equal(inferGrade(sig({}), { reps: 0 }), 'easy');
  assert.equal(inferGrade(sig({ score: null }), { reps: 0 }), null);   // попытки не было — оценки нет
  assert.equal(inferGrade(sig({ away: true }), { reps: 0 }), null);
  assert.equal(inferGrade(sig({ dwell: 100 }), { reps: 0 }), 'easy');  // быстрая удачная попытка тоже считается
});

test('попытки пишутся в базу: движок, текст, оценка, место под запись; слабые слова; сброс очищает', async () => {
  bridge.reset();
  bridge.io.picked = deckFile();
  await importLibraryFromFile();
  const s = await startSession('all', 'speak');
  const [a, b] = s.order;
  const eng = { engine: 'android-speech', transcript: 'x' };
  await insertPronunciation(a, { ...eng, score: 0.4 }, 100);
  await insertPronunciation(a, { ...eng, score: 0.6 }, 200);
  await insertPronunciation(b, { ...eng, score: 0.9, audio: '/rec/1.m4a' }, 300);   // путь к записи предусмотрен
  assert.deepEqual((await listPronunciationsSince(150)).map(r => [r.ts, r.score]), [[200, 0.6], [300, 0.9]]);
  const weak = await listWeakWords(0, 5);
  assert.deepEqual(weak.map(w => [w.front, Number(w.s.toFixed(2)), Number(w.n)]), [[s.map.get(a).front, 0.5, 2], [s.map.get(b).front, 0.9, 1]]);
  await resetProgress();
  assert.equal((await listPronunciationsSince(0)).length, 0);
});

test('нативная часть: плагин, разрешение, запрос сервиса распознавания, офлайн-пакет, поле записи пустое', () => {
  const read = f => readFileSync(f, 'utf8');
  assert.match(read(`${J}/speech/SpeechListenPlugin.java`), /RECORD_AUDIO/);
  assert.match(read(`${J}/speech/SpeechListenPlugin.java`), /requestPermissionForAlias/);
  assert.match(read(`${J}/speech/SpeechIntent.java`), /EXTRA_PREFER_OFFLINE, true/);
  assert.match(read(`${J}/speech/SpeechResult.java`), /"audio", JSObject\.NULL/);    // записи не сохраняются
  assert.match(read(`${J}/PluginList.java`), /SpeechListenPlugin\.class/);
  const m = read('android/app/src/main/AndroidManifest.xml');
  assert.match(m, /android\.permission\.RECORD_AUDIO/);
  assert.match(m, /android\.speech\.RecognitionService/);
});
