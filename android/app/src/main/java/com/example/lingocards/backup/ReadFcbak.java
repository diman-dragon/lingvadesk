package com.example.lingocards.backup;

import com.example.lingocards.core.ReadStream;
import java.io.ByteArrayInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.json.JSONObject;

public final class ReadFcbak {
    public static ParsedFcbak run(byte[] zip) throws Exception {
        JSONObject manifest = null;
        byte[] db = null;
        try (ZipInputStream z = new ZipInputStream(new ByteArrayInputStream(zip))) {
            ZipEntry e;
            while ((e = z.getNextEntry()) != null) {
                byte[] data = ReadStream.run(z);
                if (Fcbak.MANIFEST.equals(e.getName())) manifest = new JSONObject(new String(data, "UTF-8"));
                else if (Fcbak.DB.equals(e.getName())) db = data;
            }
        }
        return new ParsedFcbak(manifest, db);
    }
}
