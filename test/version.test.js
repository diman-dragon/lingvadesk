import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { APP_VERSION } from '../www/js/constants/APP_VERSION.js';

const gradle = readFileSync('android/app/build.gradle', 'utf8');

test('версия едина: package.json, APP_VERSION, CHANGELOG (gradle читает package.json)', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')).version;
  const changelog = readFileSync('CHANGELOG.md', 'utf8').match(/^## ([\d.]+)/m)[1];
  assert.equal(APP_VERSION, pkg);
  assert.equal(changelog, pkg, 'верхняя запись CHANGELOG должна совпадать с текущей версией');
  assert.match(gradle, /package\.json/);
  assert.doesNotMatch(gradle, /ref_name|APP_VERSION/, 'версия не должна зависеть от имени ветки');
});

test('обновление поверх: applicationId не менялся, versionCode растёт с версией, ключ подписи постоянный', () => {
  assert.match(gradle, /applicationId "com\.example\.lingocards"/);
  assert.match(gradle, /versionCode semCode \* 1000 \+ runNumber/);
  assert.ok(existsSync('android/app/lingvadesk-debug.keystore'), 'постоянный ключ должен лежать в репозитории');
  assert.match(gradle, /storeFile file\('lingvadesk-debug\.keystore'\)/);
  assert.match(gradle, /signingConfig System\.getenv\("KEYSTORE_PATH"\) \? signingConfigs\.release : signingConfigs\.debug/);
  assert.doesNotMatch(readFileSync('.gitignore', 'utf8'), /keystore/);
});

test('versionCode новой версии больше любого прежнего (1.0.x с номером запуска ≤ 999)', () => {
  const [a, b, c] = APP_VERSION.split('.').map(Number);
  const code = (a * 10000 + b * 100 + c) * 1000;
  assert.ok(code > 999, 'новый код должен превосходить старые коды (номера запусков CI)');
});

test('имя сборки: проект + версия (LingvaDesk-<версия>-debug.apk), артефакт CI тоже', () => {
  const wf = readFileSync('.github/workflows/android.yml', 'utf8');
  assert.match(gradle, /base \{ archivesName = "LingvaDesk-\$\{appVersion\}" \}/);
  assert.match(wf, /name: LingvaDesk-\$\{\{ steps\.ver\.outputs\.v \}\}-debug/);
  assert.match(wf, /node -p "require\('\.\/package\.json'\)\.version"/);
});
