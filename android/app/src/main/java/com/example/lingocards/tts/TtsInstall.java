package com.example.lingocards.tts;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.speech.tts.TextToSpeech;

/** Открывает экран движка синтеза «Установить голосовые данные» (сразу к скачиванию голосов); нет такого экрана — настройки синтеза речи. */
public final class TtsInstall {
    public static void run(Activity a) {
        a.runOnUiThread(() -> {
            try { a.startActivity(new Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA)); }
            catch (ActivityNotFoundException e) { a.startActivity(new Intent("com.android.settings.TTS_SETTINGS")); }
        });
    }
}
