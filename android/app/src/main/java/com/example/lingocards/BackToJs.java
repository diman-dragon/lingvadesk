package com.example.lingocards;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;

/** Системная «Назад» не закрывает приложение: событие уходит в JS, который сам решает, куда вернуться. */
public final class BackToJs {
    public static void run(BridgeActivity activity) {
        Bridge bridge = activity.getBridge();
        if (bridge == null || bridge.getWebView() == null) return;
        bridge.getWebView().evaluateJavascript("window.dispatchEvent(new Event('lingvaBack'))", null);
    }
}
