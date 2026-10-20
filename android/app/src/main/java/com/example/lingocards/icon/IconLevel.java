package com.example.lingocards.icon;

/** Уровень тревоги значка: 0 — спокойно (сегодня уже занимались или заниматься нечем), далее с 12:00 — 1, с 17:00 — 2, с 20:00 — 3 (бордовый). */
final class IconLevel {
    static int of(int hour, boolean studiedToday, boolean hasCards) {
        if (studiedToday || !hasCards) return 0;
        return hour >= 20 ? 3 : hour >= 17 ? 2 : hour >= 12 ? 1 : 0;
    }
}
