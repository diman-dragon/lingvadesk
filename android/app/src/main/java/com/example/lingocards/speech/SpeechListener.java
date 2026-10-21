package com.example.lingocards.speech;

import android.app.Activity;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.SpeechRecognizer;
import com.getcapacitor.PluginCall;

/**
 * Ждёт итог одной попытки: результат или ошибка; распознаватель после этого освобождается.
 * Ошибки 12 и 13 (язык не поддерживается / офлайн-пакет языка не загружен) при офлайн-попытке не показываются: повторяем онлайн.
 */
final class SpeechListener implements RecognitionListener {
    private final Activity activity;
    private final SpeechRecognizer recognizer;
    private final PluginCall call;
    private final boolean offline;

    SpeechListener(Activity activity, SpeechRecognizer recognizer, PluginCall call, boolean offline) {
        this.activity = activity; this.recognizer = recognizer; this.call = call; this.offline = offline;
    }

    @Override public void onResults(Bundle results) { recognizer.destroy(); call.resolve(SpeechResult.run(results)); }

    @Override public void onError(int error) {
        recognizer.destroy();
        if (offline && (error == 12 || error == 13)) SpeechStart.run(activity, call, false);
        else call.reject(SpeechErrors.text(error));
    }

    @Override public void onReadyForSpeech(Bundle params) { }
    @Override public void onBeginningOfSpeech() { }
    @Override public void onRmsChanged(float rmsdB) { }
    @Override public void onBufferReceived(byte[] buffer) { }
    @Override public void onEndOfSpeech() { }
    @Override public void onPartialResults(Bundle partialResults) { }
    @Override public void onEvent(int eventType, Bundle params) { }
}
