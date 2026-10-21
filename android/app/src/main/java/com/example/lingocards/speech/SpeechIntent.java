package com.example.lingocards.speech;

import android.content.Intent;
import android.speech.RecognizerIntent;

/** Один короткий диктант на языке слова; до 5 вариантов. offline — предпочесть офлайн-пакет (если его нет, SpeechListener повторит онлайн). */
final class SpeechIntent {
    static Intent run(String lang, boolean offline) {
        return new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
            .putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            .putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang)
            .putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, offline)
            .putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
            .putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
    }
}
