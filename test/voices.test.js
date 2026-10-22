import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import { state } from '../www/js/state/appState.js';
import { SPEAKERS } from '../www/js/constants/SPEAKERS.js';
import voiceKey from '../www/js/tts/voiceKey.js';
import resolveVoice from '../www/js/tts/resolveVoice.js';
import speakText from '../www/js/tts/speakText.js';
import voicesFor from '../www/js/tts/voicesFor.js';
import voiceLabel from '../www/js/tts/voiceLabel.js';
import loadVoiceList from '../www/js/tts/loadVoiceList.js';
import loadVoices from '../www/js/settings/loadVoices.js';
import setVoice from '../www/js/actions/setVoice.js';
import testVoice from '../www/js/actions/testVoice.js';
import loadPrefs from '../www/js/settings/loadPrefs.js';
import savePref from '../www/js/settings/savePref.js';

const bridge = installBridge();
globalThis.document ??= { documentElement: { dataset: {} }, getElementById: () => ({ classList: { add() {}, remove() {} } }) };
const VOICES = [
  { name: 'en-gb-x-rjs#male_1-local', lang: 'en-GB', quality: 400, offline: true },
  { name: 'en-us-x-sfg#female_2-local', lang: 'en-US', quality: 300, offline: true },
  { name: 'en-us-x-iom-network', lang: 'en-US', quality: 400, offline: false },
  { name: 'de-de-x-nfh-local', lang: 'de-DE', quality: 400, offline: true }
];
test.beforeEach(() => { bridge.reset(); bridge.io.voices = VOICES; bridge.io.spoken = null; state.voices = {}; state.voiceList = null; Object.assign(state.prefs, { ttsRate: '1', ttsPitch: '1' }); });

test('голоса языка: та же основа, точное совпадение первым, затем качество', () => {
  assert.deepEqual(voicesFor(VOICES, 'en-US').map(v => v.name), ['en-us-x-iom-network', 'en-us-x-sfg#female_2-local', 'en-gb-x-rjs#male_1-local']);
  assert.deepEqual(voicesFor(VOICES, 'de-DE').map(v => v.name), ['de-de-x-nfh-local']);
  assert.deepEqual(voicesFor(VOICES, 'ja-JP'), []);
});

test('подпись голоса понятна: язык, пол и номер, качество, онлайн', () => {
  assert.equal(voiceLabel(VOICES[0]), 'en-GB · мужской 1 · высокое');
  assert.equal(voiceLabel(VOICES[1]), 'en-US · женский 2');
  assert.equal(voiceLabel(VOICES[2]), 'en-US · en-us-x-iom-network · высокое · онлайн');
});

test('список голосов читается один раз (кэш), «Обновить» — заново; без движка — пустой', async () => {
  assert.equal((await loadVoiceList()).length, 4);
  bridge.io.voices = [];
  assert.equal((await loadVoiceList()).length, 4);
  assert.equal((await loadVoiceList(true)).length, 0);
});

test('выбор голоса сохраняется по ключу «язык + слот» и переживает перезапуск', async () => {
  await setVoice({ lang: 'en-US', slot: '0' }, { value: 'en-us-x-sfg#female_2-local' });
  assert.equal(resolveVoice('en-US'), 'en-us-x-sfg#female_2-local');
  assert.equal(resolveVoice('de-DE'), '');
  state.voices = {};
  await loadVoices();
  assert.equal(state.voices[voiceKey('en-US', 0)], 'en-us-x-sfg#female_2-local');
  await setVoice({ lang: 'en-US', slot: '0' }, { value: '' });          // «по умолчанию»
  assert.equal(resolveVoice('en-US'), '');
});

test('озвучка передаёт голос слота, скорость и высоту; слоты независимы (база под диалоги)', async () => {
  state.voices[voiceKey('en-US', 0)] = 'A';
  state.voices[voiceKey('en-US', 1)] = 'B';
  await savePref('ttsRate', '0.8');
  await savePref('ttsPitch', '1.2');
  await speakText('hi', 'en-US');
  assert.deepEqual(bridge.io.spoken, { text: 'hi', lang: 'en-US', voice: 'A', rate: 0.8, pitch: 1.2 });
  await speakText('hello', 'en-US', 1);
  assert.equal(bridge.io.spoken.voice, 'B');
  await speakText('hola', 'es-ES', 2);
  assert.equal(bridge.io.spoken.voice, '');
  assert.deepEqual(SPEAKERS.map(s => s.slot), [0]);
});

test('скорость и высота хранятся в настройках; проба голоса — фраза на языке', async () => {
  await savePref('ttsRate', '1.25');
  state.prefs.ttsRate = '1';
  await loadPrefs();
  assert.equal(state.prefs.ttsRate, '1.25');
  await testVoice({ lang: 'de-DE', slot: '0' });
  assert.match(bridge.io.spoken.text, /Hallo/);
  await testVoice({ lang: 'xx-XX', slot: '0' });
  assert.match(bridge.io.spoken.text, /Hello/);
});
