package com.example.lingocards.backup;

import android.content.Context;
import com.example.lingocards.core.CopyFile;
import com.example.lingocards.db.CloseDb;
import com.example.lingocards.db.DbFile;
import com.example.lingocards.db.DeleteSidecars;
import com.example.lingocards.db.GetDb;
import java.io.File;
import java.io.IOException;

/** Подменяет БД файлом tmp и проверяет результат. */
public final class SwapDb {
    public static void run(Context ctx, File tmp) throws IOException {
        File live = DbFile.run(ctx);
        CopyFile.run(tmp, live);
        DeleteSidecars.run(live);
        GetDb.run(ctx);
        CloseDb.run();
        if (!IsValidDb.run(live)) throw new IOException("verify failed");
        GetDb.run(ctx);
    }
}
