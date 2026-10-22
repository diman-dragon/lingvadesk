package com.example.lingocards.tts;

/** Ждёт запуска движка синтеза речи (до 2 с); не запустился — ошибка. */
final class TtsReady {
    static void run() throws Exception {
        for (int i = 0; i < 20 && !TtsHolder.ready; i++) Thread.sleep(100);   // движок ещё запускается — ждём
        if (!TtsHolder.ready) throw new Exception("Синтезатор речи не готов");
    }
}
