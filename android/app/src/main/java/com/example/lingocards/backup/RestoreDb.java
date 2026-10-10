package com.example.lingocards.backup;

import android.content.Context;
import com.example.lingocards.core.WriteFile;
import java.io.File;

/** Проверка → защитная копия → замена → проверка; при ошибке — откат. Возвращает имя защитной копии. */
public final class RestoreDb {
    public static String run(Context ctx, byte[] dbBytes) throws Exception {
        File tmp = new File(ctx.getCacheDir(), "restore.db");
        try {
            WriteFile.run(tmp, dbBytes);
            if (!IsValidDb.run(tmp)) throw new Exception("Файл повреждён: проверка БД не пройдена. Текущие данные не тронуты.");
            File safety = MakeSafetyCopy.run(ctx);
            try {
                SwapDb.run(ctx, tmp);
            } catch (Exception e) {
                RollbackDb.run(ctx, safety);
                throw new Exception("Восстановление не удалось, данные возвращены из защитной копии");
            }
            return safety.getName();
        } finally {
            tmp.delete();
        }
    }
}
