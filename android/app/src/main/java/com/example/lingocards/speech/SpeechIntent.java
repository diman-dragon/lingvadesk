package com.example.lingocards.speech;

import android.content.Intent;
import android.speech.RecognizerIntent;

/** Один короткий диктант на языке слова; офлайн-пакет предпочтителен, до 5 вариантов распознавания. */
final class SpeechIntent {
    static Intent run(String lang) {
        return new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
            .putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            .putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang)
            .putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true)
            .putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
            .putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
    }
}
