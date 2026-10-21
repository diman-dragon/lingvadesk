package com.example.lingocards.speech;

import android.app.Activity;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionSupport;
import android.speech.RecognitionSupportCallback;
import android.speech.SpeechRecognizer;
import androidx.annotation.RequiresApi;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

/** Android 13+: проверка офлайн-пакета языка (checkRecognitionSupport) или запуск его скачивания (triggerModelDownload). */
@RequiresApi(Build.VERSION_CODES.TIRAMISU)
final class SpeechSupport {
    static void run(Activity a, PluginCall c, String lang, boolean download) {
        a.runOnUiThread(() -> {
            SpeechRecognizer r = SpeechRecognizer.createSpeechRecognizer(a);
            if (download) {
                r.triggerModelDownload(SpeechIntent.run(lang, true));
                new Handler(Looper.getMainLooper()).postDelayed(r::destroy, 10_000);   // не рвём запрос сразу
                c.resolve(new JSObject().put("started", true));
                return;
            }
            r.checkRecognitionSupport(SpeechIntent.run(lang, true), a.getMainExecutor(), new RecognitionSupportCallback() {
                @Override public void onSupportResult(RecognitionSupport s) { r.destroy(); c.resolve(SupportResult.run(s, lang)); }
                @Override public void onError(int error) { r.destroy(); c.resolve(new JSObject().put("checked", false)); }
            });
        });
    }
}
