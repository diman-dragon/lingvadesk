package com.example.lingocards.db;

/** Схема 1 → 2: история повторений; устаревшая таблица deck_state удаляется. Должно совпадать с Schema (проверяет test/migration.test.js). */
final class MigrateV2 {
    static final String[] SQL = {
        "CREATE TABLE IF NOT EXISTS reviews(id INTEGER PRIMARY KEY AUTOINCREMENT, card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE, ts INTEGER NOT NULL, grade TEXT NOT NULL, think INTEGER, look INTEGER, fresh INTEGER NOT NULL DEFAULT 0)",
        "CREATE INDEX IF NOT EXISTS idx_reviews_ts ON reviews(ts)",
        "CREATE INDEX IF NOT EXISTS idx_reviews_card ON reviews(card_id)",
        "DROP TABLE IF EXISTS deck_state"
    };
}
