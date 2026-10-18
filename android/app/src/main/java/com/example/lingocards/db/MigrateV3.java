package com.example.lingocards.db;

/**
 * Схема 2 → 3: в истории повторений — режим, подсказка и число прослушиваний; таблица pronunciations (заготовка под проверку
 * произношения: движок, распознанный текст, оценка, путь к записи); из settings уходит то, что теперь считается по базе
 * (сохранённые сессии, счётчик дня, область учёбы). Должно совпадать с Schema (проверяет test/migration.test.js).
 */
final class MigrateV3 {
    static final String[] SQL = {
        "ALTER TABLE reviews ADD COLUMN mode TEXT NOT NULL DEFAULT 'srs'",
        "ALTER TABLE reviews ADD COLUMN hinted INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE reviews ADD COLUMN plays INTEGER NOT NULL DEFAULT 0",
        "CREATE TABLE IF NOT EXISTS pronunciations(id INTEGER PRIMARY KEY AUTOINCREMENT, card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE, ts INTEGER NOT NULL, engine TEXT, transcript TEXT, score REAL, audio TEXT)",
        "CREATE INDEX IF NOT EXISTS idx_pron_card ON pronunciations(card_id, ts)",
        "DELETE FROM settings WHERE key LIKE 'session:%' OR key IN ('today','scope')"
    };
}
