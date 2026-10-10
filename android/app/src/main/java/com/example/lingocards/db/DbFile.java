package com.example.lingocards.db;

import android.content.Context;
import java.io.File;

public final class DbFile {
    public static File run(Context ctx) { return ctx.getDatabasePath(DbConfig.NAME); }
}
