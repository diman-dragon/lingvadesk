package com.example.lingocards.tts;

import android.speech.tts.Voice;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import java.util.Set;

/** Голоса движка: name, lang (BCP-47), quality (100…500), offline (работает без сети). */
public final class TtsListVoices {
    public static JSArray run() throws Exception {
        TtsReady.run();
        JSArray out = new JSArray();
        Set<Voice> all = TtsHolder.engine.getVoices();
        if (all == null) return out;
        for (Voice v : all) {
            out.put(new JSObject().put("name", v.getName()).put("lang", v.getLocale().toLanguageTag())
                .put("quality", v.getQuality()).put("offline", !v.isNetworkConnectionRequired()));
        }
        return out;
    }
}
