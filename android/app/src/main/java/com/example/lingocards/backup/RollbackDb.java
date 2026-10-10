package com.example.lingocards.backup;

import android.content.Context;
import com.example.lingocards.core.CopyFile;
import com.example.lingocards.db.CloseDb;
import com.example.lingocards.db.DbFile;
import com.example.lingocards.db.GetDb;
import java.io.File;
import java.io.IOException;

public final class RollbackDb {
    public static void run(Context ctx, File safety) throws IOException {
        CloseDb.run();
        CopyFile.run(safety, DbFile.run(ctx));
        GetDb.run(ctx);
    }
}
