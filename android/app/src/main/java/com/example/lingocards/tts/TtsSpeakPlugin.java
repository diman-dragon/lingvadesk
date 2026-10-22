package com.example.lingocards.tts;

import com.example.lingocards.core.AtomicPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TtsSpeak")
public class TtsSpeakPlugin extends AtomicPlugin {
    @Override public void load() { TtsInit.run(getContext()); }

    @Override protected JSObject handle(PluginCall c) throws Exception {
        TtsSay.run(c.getString("text", ""), c.getString("lang", "en-US"), c.getString("voice", ""),
            c.getFloat("rate", 1f), c.getFloat("pitch", 1f));
        return new JSObject();
    }
}
