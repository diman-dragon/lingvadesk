package com.example.lingocards.icon;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

/** Будильник раз в 30 минут (неточный, без разрешений): приложение не запущено — значок всё равно пересчитывается по базе. */
public final class IconSchedule {
    public static void run(Context ctx) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pi = PendingIntent.getBroadcast(ctx, 0, new Intent(ctx, IconReceiver.class), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        am.setInexactRepeating(AlarmManager.RTC, System.currentTimeMillis() + 60_000, 30 * 60_000L, pi);
    }
}
