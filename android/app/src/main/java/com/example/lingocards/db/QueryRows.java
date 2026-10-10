package com.example.lingocards.db;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import com.example.lingocards.core.JsonToStrings;
import com.getcapacitor.JSArray;
import org.json.JSONArray;
import org.json.JSONException;

public final class QueryRows {
    public static JSArray run(SQLiteDatabase db, String sql, JSONArray params) throws JSONException {
        JSArray rows = new JSArray();
        try (Cursor c = db.rawQuery(sql, JsonToStrings.run(params))) {
            while (c.moveToNext()) rows.put(RowToJson.run(c));
        }
        return rows;
    }
}
