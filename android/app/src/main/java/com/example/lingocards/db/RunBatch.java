package com.example.lingocards.db;

import android.database.sqlite.SQLiteDatabase;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** [{sql, params}, ...] одной транзакцией. */
public final class RunBatch {
    public static void run(SQLiteDatabase db, JSONArray statements) throws JSONException {
        db.beginTransaction();
        try {
            for (int i = 0; i < statements.length(); i++) {
                JSONObject s = statements.getJSONObject(i);
                RunSql.run(db, s.getString("sql"), s.optJSONArray("params"));
            }
            db.setTransactionSuccessful();
        } finally { db.endTransaction(); }
    }
}
