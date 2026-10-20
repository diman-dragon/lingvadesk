package com.example.lingocards.icon;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Срабатывает по будильнику и после перезагрузки телефона: пересчитывает значок по базе (после перезагрузки ещё и заводит будильник). */
public class IconReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context ctx, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) IconSchedule.run(ctx);
        IconApply.run(ctx, IconQuery.level(ctx));
    }
}
