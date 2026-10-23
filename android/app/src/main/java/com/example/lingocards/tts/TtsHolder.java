package com.example.lingocards.tts;

import android.speech.tts.TextToSpeech;
import com.getcapacitor.PluginCall;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Только состояние движка: сам движок, готовность и вызовы JS, ждущие окончания своей реплики (id реплики → вызов). */
final class TtsHolder {
    static TextToSpeech engine;
    static volatile boolean ready;
    static final Map<String, PluginCall> pending = new ConcurrentHashMap<>();
}
