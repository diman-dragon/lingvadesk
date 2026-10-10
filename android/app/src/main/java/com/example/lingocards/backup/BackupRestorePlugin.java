package com.example.lingocards.backup;

import com.example.lingocards.core.AtomicPlugin;
import com.example.lingocards.core.DecodeBase64;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "BackupRestore")
public class BackupRestorePlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) throws Exception {
        ParsedFcbak parsed = ReadFcbak.run(DecodeBase64.run(c.getString("data", "")));
        CheckManifest.run(parsed);
        return new JSObject().put("safety", RestoreDb.run(getContext(), parsed.db));
    }
}
