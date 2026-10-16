import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const J = 'android/app/src/main/java/com/example/lingocards/db';
const strings = f => [...readFileSync(`${J}/${f}`, 'utf8').matchAll(/"((?:[^"\\]|\\.)+)"/g)].map(m => m[1]);
// схема версии 1.2.x (до истории повторений) — как её создавали старые установки
const V1 = [
  "CREATE TABLE languages(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, tts TEXT NOT NULL DEFAULT 'en-US')",
  'CREATE TABLE decks(id INTEGER PRIMARY KEY AUTOINCREMENT, language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE, name TEXT NOT NULL, created INTEGER NOT NULL)',
  'CREATE TABLE cards(id INTEGER PRIMARY KEY AUTOINCREMENT, deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE, front TEXT NOT NULL, back TEXT NOT NULL, example TEXT, example_tr TEXT, ord INTEGER NOT NULL DEFAULT 0, due INTEGER NOT NULL DEFAULT 0, interval INTEGER NOT NULL DEFAULT 0, ease REAL NOT NULL DEFAULT 2.5, reps INTEGER NOT NULL DEFAULT 0)',
  'CREATE INDEX idx_cards_deck ON cards(deck_id, ord)',
  'CREATE TABLE deck_state(deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE, mode TEXT NOT NULL, pos INTEGER NOT NULL DEFAULT 0, order_json TEXT, PRIMARY KEY(deck_id, mode))',
  'CREATE TABLE settings(key TEXT PRIMARY KEY, value TEXT)'
];
const shape = db => Object.fromEntries(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()
  .map(t => [t.name, db.prepare(`PRAGMA table_info(${t.name})`).all().map(c => `${c.name}:${c.type}:${c.notnull}:${c.dflt_value}:${c.pk}`)]));

test('миграция 1 → 2 даёт ту же схему, что и чистая установка; данные сохраняются, deck_state удаляется', () => {
  const old = new DatabaseSync(':memory:');
  V1.forEach(s => old.exec(s));
  old.exec("INSERT INTO languages(name) VALUES('EN'); INSERT INTO decks(language_id,name,created) VALUES(1,'D',1); INSERT INTO cards(deck_id,front,back,due,interval,reps) VALUES(1,'a','б',5,3,2); INSERT INTO settings VALUES('today','{}')");
  strings('MigrateV2.java').forEach(s => old.exec(s));
  const fresh = new DatabaseSync(':memory:');
  strings('Schema.java').filter(s => s.startsWith('CREATE')).forEach(s => fresh.exec(s));
  assert.deepEqual(shape(old), shape(fresh));
  assert.equal(old.prepare('SELECT interval,reps FROM cards').get().interval, 3);
  assert.equal(old.prepare('SELECT COUNT(*) n FROM settings').get().n, 1);
  assert.equal(old.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE name='deck_state'").get().n, 0);
  old.exec('PRAGMA foreign_keys=ON');
  old.exec("INSERT INTO reviews(card_id,ts,grade) VALUES(1,1,'good')");
  old.exec('DELETE FROM cards');                                  // отзывы удаляются каскадом
  assert.equal(old.prepare('SELECT COUNT(*) n FROM reviews').get().n, 0);
});

test('версия схемы повышена, миграция подключена, проверка резервной копии принимает копии обеих версий', () => {
  assert.match(readFileSync(`${J}/DbConfig.java`, 'utf8'), /VER = 2/);
  assert.match(readFileSync(`${J}/DbHelper.java`, 'utf8'), /Migrate\.run\(db, from\)/);
  assert.match(readFileSync(`${J}/Migrate.java`, 'utf8'), /from < 2/);
  const v = readFileSync('android/app/src/main/java/com/example/lingocards/backup/IsValidDb.java', 'utf8');
  assert.match(v, /IN \('languages','decks','cards','settings'\)/);   // копия v1 (есть deck_state) тоже подходит
  assert.match(v, /getInt\(0\) == 4/);
});

test('экран не гаснет и вибрация: плагин зарегистрирован, разрешение в манифесте', () => {
  assert.match(readFileSync('android/app/src/main/java/com/example/lingocards/PluginList.java', 'utf8'), /KeepAwakePlugin\.class/);
  assert.match(readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8'), /android\.permission\.VIBRATE/);
  assert.match(readFileSync('android/app/src/main/java/com/example/lingocards/screen/KeepAwakePlugin.java', 'utf8'), /FLAG_KEEP_SCREEN_ON/);
  assert.match(readFileSync('android/app/src/main/java/com/example/lingocards/tts/TtsSay.java', 'utf8'), /Thread\.sleep/);   // ждём запуска движка
});
