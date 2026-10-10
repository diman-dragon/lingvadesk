import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync('www/index.html', 'utf8');
const config = JSON.parse(readFileSync('capacitor.config.json', 'utf8'));

test('index.html: каждый script/link указывает на существующий файл (иначе экран пустой)', () => {
  const refs = [...html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g)].map(m => m[1]);
  assert.ok(refs.some(r => r.endsWith('main.js')), 'нет точки входа main.js');
  for (const r of refs) assert.ok(existsSync(`www/${r}`), `нет файла www/${r}`);
});

test('index.html: есть контейнеры #app и #toast', () => {
  assert.match(html, /id="app"/);
  assert.match(html, /id="toast"/);
});

test('capacitor.config.json: webDir существует и содержит index.html', () => {
  assert.ok(existsSync(`${config.webDir}/index.html`));
  assert.equal(config.appId, 'com.example.lingocards');
});

test('plugin(): работает без Capacitor.registerPlugin и сообщает понятную ошибку без моста', async () => {
  const saved = globalThis.Capacitor;
  const { default: plugin } = await import('../www/js/native/plugin.js');
  globalThis.Capacitor = { nativePromise: async (n, m, o) => ({ n, m, o }) };
  assert.deepEqual(await plugin('DbQuery').exec({ a: 1 }), { n: 'DbQuery', m: 'exec', o: { a: 1 } });
  globalThis.Capacitor = { registerPlugin: n => ({ exec: async () => n }) };
  assert.equal(await plugin('X').exec(), 'X');
  globalThis.Capacitor = {};
  assert.throws(() => plugin('X'), /недоступен/);
  globalThis.Capacitor = saved;
});
