package com.example.lingocards.speech;

import android.speech.SpeechRecognizer;

/** Код ошибки распознавателя → понятное сообщение (12 и 13 — константы API 31, поэтому числами). */
final class SpeechErrors {
    static String text(int e) {
        if (e == SpeechRecognizer.ERROR_NO_MATCH || e == SpeechRecognizer.ERROR_SPEECH_TIMEOUT) return "Не расслышал: нажмите микрофон и скажите ещё раз";
        if (e == SpeechRecognizer.ERROR_NETWORK || e == SpeechRecognizer.ERROR_NETWORK_TIMEOUT || e == 11) return "Нужен интернет или офлайн-пакет языка (Настройки Google → Голосовой ввод → Офлайн-распознавание)";
        if (e == 12 || e == 13) return "Язык не поддерживается распознавателем или его пакет не загружен: Настройки Google → Голосовой ввод → Языки";
        if (e == SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS) return "Нет доступа к микрофону";
        if (e == SpeechRecognizer.ERROR_RECOGNIZER_BUSY || e == 10) return "Распознаватель занят, попробуйте ещё раз";
        return "Ошибка распознавания (код " + e + ")";
    }
}
