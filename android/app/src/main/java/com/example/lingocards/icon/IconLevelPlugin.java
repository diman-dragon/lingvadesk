package com.example.lingocards.icon;

import com.example.lingocards.core.AtomicPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Значок приложения. { level } — поставить уровень; { sync: true } — пересчитать по базе; { schedule: true } — завести будильник. → { level } */
@CapacitorPlugin(name = "IconLevel")
public class IconLevelPlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) {
        int level = c.getInt("level", -1);
        if (level < 0 && c.getBoolean("sync", false)) level = IconQuery.level(getContext());
        if (level >= 0) IconApply.run(getContext(), level);
        if (c.getBoolean("schedule", false)) IconSchedule.run(getContext());
        return new JSObject().put("level", level);
    }
}
