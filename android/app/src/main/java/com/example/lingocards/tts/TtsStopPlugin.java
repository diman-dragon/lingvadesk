package com.example.lingocards.tts;

import com.example.lingocards.core.AtomicPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TtsStop")
public class TtsStopPlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) {
        TtsStop.run();
        return new JSObject();
    }
}
