package com.example.lingocards.speech;

import android.os.Build;
import android.speech.RecognitionSupport;
import androidx.annotation.RequiresApi;
import com.getcapacitor.JSObject;
import java.util.List;

/** Что умеет распознаватель для языка: installed — офлайн-пакет установлен, supported — его можно скачать, pending — уже скачивается, online — работает через сеть. */
@RequiresApi(Build.VERSION_CODES.TIRAMISU)
final class SupportResult {
    static JSObject run(RecognitionSupport s, String lang) {
        return new JSObject().put("checked", true)
            .put("installed", has(s.getInstalledOnDeviceLanguages(), lang))
            .put("supported", has(s.getSupportedOnDeviceLanguages(), lang))
            .put("pending", has(s.getPendingOnDeviceLanguages(), lang))
            .put("online", has(s.getOnlineLanguages(), lang));
    }

    private static boolean has(List<String> tags, String lang) {
        for (String t : tags) if (t.replace('_', '-').equalsIgnoreCase(lang)) return true;
        return false;
    }
}
