package com.example.lingocards.speech;

import android.Manifest;
import com.example.lingocards.core.AtomicPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

/**
 * Проверка произношения: слушает микрофон встроенным распознавателем (сервисы Google) и возвращает
 * { text, confidence (-1 — неизвестна), alternatives[], audio (всегда null: записи не сохраняются, но поле предусмотрено) }.
 */
@CapacitorPlugin(name = "SpeechListen", permissions = @Permission(alias = "mic", strings = { Manifest.permission.RECORD_AUDIO }))
public class SpeechListenPlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) {
        if (getPermissionState("mic") == PermissionState.GRANTED) SpeechStart.run(getActivity(), c);
        else requestPermissionForAlias("mic", c, "onPermission");
        return null;
    }

    @PermissionCallback
    private void onPermission(PluginCall c) {
        if (getPermissionState("mic") == PermissionState.GRANTED) SpeechStart.run(getActivity(), c);
        else c.reject("Нет доступа к микрофону: разрешите его в настройках приложения");
    }
}
