package com.example.lingocards.anki;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import com.getcapacitor.JSArray;
import java.io.File;
import java.io.FileOutputStream;

/** Поля заметок из SQLite-коллекции Anki (collection.anki2 / anki21): [[поле1, поле2, …], …]; не больше 20 000 заметок. */
final class AnkiNotes {
    static JSArray run(Context ctx, byte[] sqlite) throws Exception {
        File f = File.createTempFile("anki", ".db", ctx.getCacheDir());
        try {
            try (FileOutputStream out = new FileOutputStream(f)) { out.write(sqlite); }
            JSArray notes = new JSArray();
            try (SQLiteDatabase db = SQLiteDatabase.openDatabase(f.getPath(), null, SQLiteDatabase.OPEN_READONLY);
                 Cursor c = db.rawQuery("SELECT flds FROM notes ORDER BY id LIMIT 20000", null)) {
                while (c.moveToNext()) {
                    JSArray fields = new JSArray();
                    for (String s : c.getString(0).split("\u001f", -1)) fields.put(s);
                    notes.put(fields);
                }
            }
            return notes;
        } finally {
            f.delete();
        }
    }
}
