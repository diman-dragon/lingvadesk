import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const RES = 'android/app/src/main/res';
const SIZES = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
const png = p => { const b = readFileSync(p); return { sig: b.subarray(1, 4).toString(), w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; };

test('манифест подключает иконки', () => {
  const m = readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
  assert.match(m, /android:icon="@mipmap\/ic_launcher"/);
  assert.match(m, /android:roundIcon="@mipmap\/ic_launcher_round"/);
});

test('PNG-иконки для всех плотностей имеют правильный размер', () => {
  for (const [d, n] of Object.entries(SIZES)) for (const name of ['ic_launcher', 'ic_launcher_round']) {
    const i = png(`${RES}/mipmap-${d}/${name}.png`);
    assert.deepEqual([i.sig, i.w, i.h], ['PNG', n, n], `${d}/${name}`);
  }
  assert.equal(png('assets/icon-512.png').w, 512);
});

test('adaptive-иконка: фон, передний план и монохромный слой существуют', () => {
  const xml = readFileSync(`${RES}/mipmap-anydpi-v26/ic_launcher.xml`, 'utf8');
  for (const r of xml.match(/@drawable\/\w+/g)) assert.ok(existsSync(`${RES}/drawable/${r.slice(10)}.xml`), r);
  assert.match(xml, /<monochrome/);
});
