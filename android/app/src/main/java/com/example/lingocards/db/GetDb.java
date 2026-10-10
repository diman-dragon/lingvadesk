package com.example.lingocards.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;

public final class GetDb {
    public static SQLiteDatabase run(Context ctx) {
        synchronized (DbHolder.class) {
            if (DbHolder.instance == null) DbHolder.instance = new DbHelper(ctx.getApplicationContext());
            return DbHolder.instance.getWritableDatabase();
        }
    }
}
