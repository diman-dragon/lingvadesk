package com.example.lingocards.core;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** JSON-массив → аргументы биндинга (JSON null → SQL NULL). */
public final class JsonToArgs {
    public static Object[] run(JSONArray a) throws JSONException {
        Object[] out = new Object[a == null ? 0 : a.length()];
        for (int i = 0; i < out.length; i++) {
            Object v = a.get(i);
            out[i] = JSONObject.NULL.equals(v) ? null : v;
        }
        return out;
    }
}
