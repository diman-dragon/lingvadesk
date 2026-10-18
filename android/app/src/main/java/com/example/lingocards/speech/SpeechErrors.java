package com.example.lingocards.speech;

import android.speech.SpeechRecognizer;

/** Код ошибки распознавателя → понятное сообщение. */
final class SpeechErrors {
    static String text(int e) {
        if (e == SpeechRecognizer.ERROR_NO_MATCH || e == SpeechRecognizer.ERROR_SPEECH_TIMEOUT) return "Не расслышал: нажмите микрофон и скажите ещё раз";
        if (e == SpeechRecognizer.ERROR_NETWORK || e == SpeechRecognizer.ERROR_NETWORK_TIMEOUT) return "Нужен интернет или офлайн-пакет языка в настройках Google";
        if (e == SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS) return "Нет доступа к микрофону";
        if (e == SpeechRecognizer.ERROR_RECOGNIZER_BUSY) return "Распознаватель занят, попробуйте ещё раз";
        return "Ошибка распознавания (код " + e + ")";
    }
}
