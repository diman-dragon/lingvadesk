package com.example.lingocards.core;

import org.json.JSONArray;
import org.json.JSONException;

/** rawQuery принимает только строки. */
public final class JsonToStrings {
    public static String[] run(JSONArray a) throws JSONException {
        String[] out = new String[a == null ? 0 : a.length()];
        for (int i = 0; i < out.length; i++) out[i] = String.valueOf(a.get(i));
        return out;
    }
}
