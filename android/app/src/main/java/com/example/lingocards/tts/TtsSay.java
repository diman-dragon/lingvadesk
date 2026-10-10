package com.example.lingocards.tts;

import android.speech.tts.TextToSpeech;
import java.util.Locale;

public final class TtsSay {
    public static void run(String text, String lang) throws Exception {
        if (!TtsHolder.ready) throw new Exception("Синтезатор речи не готов");
        int r = TtsHolder.engine.setLanguage(Locale.forLanguageTag(lang));
        if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED)
            throw new Exception("Голос для языка недоступен: " + lang);
        TtsHolder.engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "fc");
    }
}
