package com.example.lingocards.icon;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteStatement;
import com.example.lingocards.db.GetDb;
import java.util.Calendar;

/** Считает уровень значка по базе: были ли повторения с начала местных суток и есть ли карточки (новые или пора повторять). */
public final class IconQuery {
    public static int level(Context ctx) {
        try {
            SQLiteDatabase db = GetDb.run(ctx);
            Calendar now = Calendar.getInstance(), day = (Calendar) now.clone();
            day.set(Calendar.HOUR_OF_DAY, 0); day.set(Calendar.MINUTE, 0); day.set(Calendar.SECOND, 0); day.set(Calendar.MILLISECOND, 0);
            boolean studied = count(db, "SELECT COUNT(*) FROM reviews WHERE ts>=" + day.getTimeInMillis()) > 0;
            boolean cards = count(db, "SELECT COUNT(*) FROM cards WHERE due<=" + now.getTimeInMillis()) > 0;
            return IconLevel.of(now.get(Calendar.HOUR_OF_DAY), studied, cards);
        } catch (Exception e) {
            return 0;
        }
    }

    private static long count(SQLiteDatabase db, String sql) {
        SQLiteStatement s = db.compileStatement(sql);
        try { return s.simpleQueryForLong(); } finally { s.close(); }
    }
}
