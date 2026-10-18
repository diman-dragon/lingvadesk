package com.example.lingocards.speech;

import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.SpeechRecognizer;
import com.getcapacitor.PluginCall;

/** Ждёт итог одной попытки: результат или ошибка; распознаватель после этого освобождается. */
final class SpeechListener implements RecognitionListener {
    private final SpeechRecognizer recognizer;
    private final PluginCall call;

    SpeechListener(SpeechRecognizer recognizer, PluginCall call) { this.recognizer = recognizer; this.call = call; }

    @Override public void onResults(Bundle results) { recognizer.destroy(); call.resolve(SpeechResult.run(results)); }
    @Override public void onError(int error) { recognizer.destroy(); call.reject(SpeechErrors.text(error)); }
    @Override public void onReadyForSpeech(Bundle params) { }
    @Override public void onBeginningOfSpeech() { }
    @Override public void onRmsChanged(float rmsdB) { }
    @Override public void onBufferReceived(byte[] buffer) { }
    @Override public void onEndOfSpeech() { }
    @Override public void onPartialResults(Bundle partialResults) { }
    @Override public void onEvent(int eventType, Bundle params) { }
}
