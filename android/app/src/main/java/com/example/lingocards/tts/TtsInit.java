package com.example.lingocards.tts;

import android.content.Context;
import android.speech.tts.TextToSpeech;

public final class TtsInit {
    public static synchronized void run(Context ctx) {
        if (TtsHolder.engine == null)
            TtsHolder.engine = new TextToSpeech(ctx.getApplicationContext(), s -> TtsHolder.ready = (s == TextToSpeech.SUCCESS));
    }
}
