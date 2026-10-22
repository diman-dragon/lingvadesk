package com.example.lingocards.tts;

import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import java.util.Locale;

public final class TtsSay {
    /** Сначала язык (он сбрасывает голос), затем выбранный голос, скорость и высота; потом речь. */
    public static void run(String text, String lang, String voice, float rate, float pitch) throws Exception {
        TtsReady.run();
        int r = TtsHolder.engine.setLanguage(Locale.forLanguageTag(lang));
        if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED)
            throw new Exception("Голос для языка недоступен: " + lang);
        Voice v = TtsPickVoice.run(voice);
        if (v != null) TtsHolder.engine.setVoice(v);
        TtsHolder.engine.setSpeechRate(Math.max(0.3f, Math.min(rate, 2.5f)));
        TtsHolder.engine.setPitch(Math.max(0.5f, Math.min(pitch, 2f)));
        TtsHolder.engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "fc");
    }
}
