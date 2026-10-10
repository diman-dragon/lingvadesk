package com.example.lingocards.backup;

import com.example.lingocards.db.DbConfig;

public final class CheckManifest {
    public static void run(ParsedFcbak p) throws Exception {
        if (p.manifest == null || p.db == null || !Fcbak.FORMAT.equals(p.manifest.optString("format")))
            throw new Exception("Это не файл .fcbak");
        if (p.manifest.optInt("dbVersion") > DbConfig.VER)
            throw new Exception("Копия создана более новой версией приложения");
    }
}
