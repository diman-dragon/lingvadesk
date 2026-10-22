package com.example.lingocards.tts;

import com.example.lingocards.core.AtomicPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TtsInstall")
public class TtsInstallPlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) {
        TtsInstall.run(getActivity());
        return new JSObject();
    }
}
