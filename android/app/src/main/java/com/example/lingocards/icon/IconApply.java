package com.example.lingocards.icon;

import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageManager;

/** Включает значок приложения уровня level (0 — обычный, 1 — янтарный, 2 — красный, 3 — бордовый), остальные выключает. Приложение не перезапускается. */
public final class IconApply {
    public static void run(Context ctx, int level) {
        PackageManager pm = ctx.getPackageManager();
        for (int pass = 0; pass < 2; pass++) {              // сначала включаем нужный, потом выключаем прочие — чтобы значок не пропадал
            for (int i = 0; i < 4; i++) {
                if ((i == level) != (pass == 0)) continue;
                ComponentName alias = new ComponentName(ctx.getPackageName(), "com.example.lingocards.IconL" + i);
                pm.setComponentEnabledSetting(alias, i == level ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
            }
        }
    }
}
