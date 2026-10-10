package com.example.lingocards.db;

import com.example.lingocards.core.AtomicPlugin;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DbRun")
public class DbRunPlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) throws Exception {
        long id = RunSql.run(GetDb.run(getContext()), c.getString("sql"), c.getArray("params", new JSArray()));
        return new JSObject().put("id", id);
    }
}
