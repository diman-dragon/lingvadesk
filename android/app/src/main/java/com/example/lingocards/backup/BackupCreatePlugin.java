package com.example.lingocards.backup;

import com.example.lingocards.core.AtomicPlugin;
import com.example.lingocards.core.EncodeBase64;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "BackupCreate")
public class BackupCreatePlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) throws Exception {
        return new JSObject().put("data", EncodeBase64.run(BuildFcbak.run(getContext())));
    }
}
