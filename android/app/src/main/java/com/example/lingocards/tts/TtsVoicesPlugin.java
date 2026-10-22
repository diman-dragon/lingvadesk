package com.example.lingocards.tts;

import com.example.lingocards.core.AtomicPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TtsVoices")
public class TtsVoicesPlugin extends AtomicPlugin {
    @Override public void load() { TtsInit.run(getContext()); }

    @Override protected JSObject handle(PluginCall c) throws Exception {
        return new JSObject().put("voices", TtsListVoices.run());
    }
}
