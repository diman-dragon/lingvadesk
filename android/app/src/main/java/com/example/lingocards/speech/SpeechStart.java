package com.example.lingocards.speech;

import android.app.Activity;
import android.speech.SpeechRecognizer;
import com.getcapacitor.PluginCall;

/** Запускает распознавание в главном потоке (SpeechRecognizer работает только там). */
final class SpeechStart {
    static void run(Activity a, PluginCall c) {
        a.runOnUiThread(() -> {
            if (!SpeechRecognizer.isRecognitionAvailable(a)) {
                c.reject("Распознавание речи недоступно на этом устройстве");
                return;
            }
            SpeechRecognizer r = SpeechRecognizer.createSpeechRecognizer(a);
            r.setRecognitionListener(new SpeechListener(r, c));
            r.startListening(SpeechIntent.run(c.getString("lang", "en-US")));
        });
    }
}
