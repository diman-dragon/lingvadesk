package com.example.lingocards.backup;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import java.io.File;

/** integrity_check + наличие всех 5 таблиц схемы. */
public final class IsValidDb {
    private static final String TABLES =
        "SELECT count(*) FROM sqlite_master WHERE type='table' AND name IN ('languages','decks','cards','deck_state','settings')";

    public static boolean run(File f) {
        SQLiteDatabase db = null;
        try {
            db = SQLiteDatabase.openDatabase(f.getPath(), null, SQLiteDatabase.OPEN_READONLY);
            try (Cursor c = db.rawQuery("PRAGMA integrity_check", null)) {
                if (!c.moveToFirst() || !"ok".equals(c.getString(0))) return false;
            }
            try (Cursor c = db.rawQuery(TABLES, null)) { return c.moveToFirst() && c.getInt(0) == 5; }
        } catch (Exception e) {
            return false;
        } finally {
            if (db != null) db.close();
        }
    }
}
