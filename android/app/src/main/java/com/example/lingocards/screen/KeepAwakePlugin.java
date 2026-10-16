package com.example.lingocards.screen;

import android.view.WindowManager;
import com.example.lingocards.core.AtomicPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Экран не гаснет, пока идёт учёба: on=true включает флаг окна, on=false снимает. */
@CapacitorPlugin(name = "KeepAwake")
public class KeepAwakePlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) {
        final boolean on = c.getBoolean("on", false);
        getActivity().runOnUiThread(() -> {
            if (on) getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        });
        return new JSObject();
    }
}
