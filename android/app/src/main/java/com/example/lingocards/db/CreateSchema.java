package com.example.lingocards.db;

import android.database.sqlite.SQLiteDatabase;

public final class CreateSchema {
    public static void run(SQLiteDatabase db) { for (String ddl : Schema.DDL) db.execSQL(ddl); }
}
