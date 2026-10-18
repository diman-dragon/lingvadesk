package com.example.lingocards.db;

import android.database.sqlite.SQLiteDatabase;

/** Миграции по версиям схемы: данные существующих установок и старых резервных копий сохраняются. */
public final class Migrate {
    public static void run(SQLiteDatabase db, int from) {
        if (from < 2) for (String sql : MigrateV2.SQL) db.execSQL(sql);
        if (from < 3) for (String sql : MigrateV3.SQL) db.execSQL(sql);
    }
}
