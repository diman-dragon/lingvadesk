package com.example.lingocards.tts;

import android.speech.tts.TextToSpeech;

/** Только состояние движка. */
final class TtsHolder {
    static TextToSpeech engine;
    static volatile boolean ready;
}
