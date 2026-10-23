package com.example.lingocards.tts;

import android.speech.tts.UtteranceProgressListener;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

/** Окончание реплики: вызов JS, ждавший её (wait: true), получает { interrupted } — реплика дозвучала (false) или её прервали stop() / новая речь (true). */
final class TtsProgress extends UtteranceProgressListener {
    static final TtsProgress INSTANCE = new TtsProgress();

    private static void finish(String id, boolean interrupted) {
        PluginCall c = TtsHolder.pending.remove(id);
        if (c != null) c.resolve(new JSObject().put("interrupted", interrupted));
    }

    @Override public void onStart(String id) { }
    @Override public void onDone(String id) { finish(id, false); }
    @Override public void onStop(String id, boolean interrupted) { finish(id, true); }
    @Override @SuppressWarnings("deprecation") public void onError(String id) {
        PluginCall c = TtsHolder.pending.remove(id);
        if (c != null) c.reject("Ошибка синтеза речи");
    }
}
