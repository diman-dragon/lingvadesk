package com.example.lingocards.db;

/** Схема 3 → 4: таблица games — результаты игрового режима (очки, верные и ошибочные ответы, лучший комбо). Должно совпадать с Schema (test/migration.test.js). */
final class MigrateV4 {
    static final String[] SQL = {
        "CREATE TABLE IF NOT EXISTS games(id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, scope TEXT NOT NULL, score INTEGER NOT NULL, correct INTEGER NOT NULL, wrong INTEGER NOT NULL, best_combo INTEGER NOT NULL DEFAULT 0, seconds INTEGER NOT NULL DEFAULT 0)",
        "CREATE INDEX IF NOT EXISTS idx_games_ts ON games(ts)"
    };
}
