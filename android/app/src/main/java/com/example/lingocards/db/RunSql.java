package com.example.lingocards.db;

import android.database.DatabaseUtils;
import android.database.sqlite.SQLiteDatabase;
import com.example.lingocards.core.JsonToArgs;
import org.json.JSONArray;
import org.json.JSONException;

/** Выполняет запрос и возвращает last_insert_rowid. */
public final class RunSql {
    public static long run(SQLiteDatabase db, String sql, JSONArray params) throws JSONException {
        db.execSQL(sql, JsonToArgs.run(params));
        return DatabaseUtils.longForQuery(db, "SELECT last_insert_rowid()", null);
    }
}
