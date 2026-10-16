package com.example.lingocards.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/** Только колбэки фреймворка; вся логика — в отдельных классах. WAL выключен: БД = один файл. */
public class DbHelper extends SQLiteOpenHelper {
    public DbHelper(Context c) { super(c, DbConfig.NAME, null, DbConfig.VER); }

    @Override public void onConfigure(SQLiteDatabase db) {
        db.disableWriteAheadLogging();
        db.setForeignKeyConstraintsEnabled(true);
    }
    @Override public void onCreate(SQLiteDatabase db) { CreateSchema.run(db); }
    @Override public void onUpgrade(SQLiteDatabase db, int from, int to) { Migrate.run(db, from); }
}
