package com.example.lingocards.db;

import java.io.File;

public final class DeleteSidecars {
    public static void run(File db) {
        for (String suffix : new String[] { "-wal", "-shm", "-journal" }) new File(db.getPath() + suffix).delete();
    }
}
