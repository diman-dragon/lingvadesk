package com.example.lingocards.tts;

import android.speech.tts.Voice;
import java.util.Set;

/** Голос движка по имени; null — имя пустое или такого голоса на устройстве нет (тогда говорит голос по умолчанию). */
final class TtsPickVoice {
    static Voice run(String name) {
        if (name == null || name.isEmpty()) return null;
        Set<Voice> all = TtsHolder.engine.getVoices();
        if (all == null) return null;
        for (Voice v : all) if (name.equals(v.getName())) return v;
        return null;
    }
}
