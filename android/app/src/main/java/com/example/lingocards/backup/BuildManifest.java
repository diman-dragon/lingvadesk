package com.example.lingocards.backup;

import com.example.lingocards.db.DbConfig;
import org.json.JSONException;
import org.json.JSONObject;

public final class BuildManifest {
    public static JSONObject run() throws JSONException {
        return new JSONObject()
            .put("format", Fcbak.FORMAT)
            .put("version", Fcbak.VERSION)
            .put("dbVersion", DbConfig.VER)
            .put("created", System.currentTimeMillis());
    }
}
