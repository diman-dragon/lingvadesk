package com.example.lingocards.db;

/** Схема 4 → 5: диалоги. decks.kind — 'cards' (обычная колода) или 'dialog' (сцена); cards.speaker — роль реплики (0 — нет, 1…3). Должно совпадать с Schema (test/migration.test.js). */
final class MigrateV5 {
    static final String[] SQL = {
        "ALTER TABLE decks ADD COLUMN kind TEXT NOT NULL DEFAULT 'cards'",
        "ALTER TABLE cards ADD COLUMN speaker INTEGER NOT NULL DEFAULT 0"
    };
}
