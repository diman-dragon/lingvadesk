package com.example.lingocards.db;

import com.example.lingocards.core.AtomicPlugin;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DbBatch")
public class DbBatchPlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) throws Exception {
        RunBatch.run(GetDb.run(getContext()), c.getArray("statements", new JSArray()));
        return new JSObject();
    }
}
