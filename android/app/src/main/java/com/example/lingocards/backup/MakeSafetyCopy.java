package com.example.lingocards.backup;

import android.content.Context;
import com.example.lingocards.core.CopyFile;
import com.example.lingocards.db.CloseDb;
import com.example.lingocards.db.DbFile;
import com.example.lingocards.db.GetDb;
import java.io.File;
import java.io.IOException;

/** Закрывает БД и копирует её в files/backups/pre-restore-<ts>.db */
public final class MakeSafetyCopy {
    public static File run(Context ctx) throws IOException {
        GetDb.run(ctx);
        CloseDb.run();
        File dir = new File(ctx.getFilesDir(), "backups");
        dir.mkdirs();
        File safety = new File(dir, "pre-restore-" + System.currentTimeMillis() + ".db");
        CopyFile.run(DbFile.run(ctx), safety);
        return safety;
    }
}
