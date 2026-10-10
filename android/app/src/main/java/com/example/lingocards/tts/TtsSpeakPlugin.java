package com.example.lingocards.tts;

import com.example.lingocards.core.AtomicPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TtsSpeak")
public class TtsSpeakPlugin extends AtomicPlugin {
    @Override public void load() { TtsInit.run(getContext()); }

    @Override protected JSObject handle(PluginCall c) throws Exception {
        TtsSay.run(c.getString("text", ""), c.getString("lang", "en-US"));
        return new JSObject();
    }
}
