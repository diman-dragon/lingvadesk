package com.example.lingocards.backup;

import android.content.Context;
import com.example.lingocards.core.ReadFile;
import com.example.lingocards.db.DbFile;
import com.example.lingocards.db.GetDb;
import java.io.ByteArrayOutputStream;
import java.util.zip.ZipOutputStream;

/** ZIP { manifest.json, app.db }. */
public final class BuildFcbak {
    public static byte[] run(Context ctx) throws Exception {
        GetDb.run(ctx); // файл БД гарантированно существует
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ZipOutputStream z = new ZipOutputStream(bytes)) {
            ZipPut.run(z, Fcbak.MANIFEST, BuildManifest.run().toString(2).getBytes("UTF-8"));
            ZipPut.run(z, Fcbak.DB, ReadFile.run(DbFile.run(ctx)));
        }
        return bytes.toByteArray();
    }
}
