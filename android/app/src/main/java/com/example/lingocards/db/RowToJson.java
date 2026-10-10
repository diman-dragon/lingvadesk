package com.example.lingocards.db;

import android.database.Cursor;
import com.getcapacitor.JSObject;
import org.json.JSONObject;

public final class RowToJson {
    public static JSObject run(Cursor c) {
        JSObject o = new JSObject();
        for (int i = 0; i < c.getColumnCount(); i++) {
            String name = c.getColumnName(i);
            switch (c.getType(i)) {
                case Cursor.FIELD_TYPE_NULL: o.put(name, JSONObject.NULL); break;
                case Cursor.FIELD_TYPE_INTEGER: o.put(name, c.getLong(i)); break;
                case Cursor.FIELD_TYPE_FLOAT: o.put(name, c.getDouble(i)); break;
                default: o.put(name, c.getString(i));
            }
        }
        return o;
    }
}
