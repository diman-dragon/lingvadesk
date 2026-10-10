package com.example.lingocards.backup;

import org.json.JSONObject;

public final class ParsedFcbak {
    public final JSONObject manifest;
    public final byte[] db;
    public ParsedFcbak(JSONObject manifest, byte[] db) { this.manifest = manifest; this.db = db; }
}
