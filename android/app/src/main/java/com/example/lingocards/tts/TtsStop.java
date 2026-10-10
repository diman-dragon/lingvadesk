package com.example.lingocards.tts;

public final class TtsStop {
    public static void run() { if (TtsHolder.engine != null) TtsHolder.engine.stop(); }
}
