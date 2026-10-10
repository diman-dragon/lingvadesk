package com.example.lingocards.core;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

/** База «один плагин — одна операция»: единственный метод exec, единая обработка ошибок. */
public abstract class AtomicPlugin extends Plugin {
    /** Вернуть результат; null — ответ придёт позже (activity result). */
    protected abstract JSObject handle(PluginCall call) throws Exception;

    @PluginMethod
    public final void exec(PluginCall call) { settle(call, () -> handle(call)); }

    protected void settle(PluginCall call, Task task) {
        if (call == null) return;
        try {
            JSObject r = task.run();
            if (r != null) call.resolve(r);
        } catch (Exception e) {
            call.reject(String.valueOf(e.getMessage()), e);
        }
    }
}
