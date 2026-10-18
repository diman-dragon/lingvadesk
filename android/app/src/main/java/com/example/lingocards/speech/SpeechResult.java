package com.example.lingocards.speech;

import android.os.Bundle;
import android.speech.SpeechRecognizer;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import java.util.ArrayList;

/** Результат распознавания → { text, confidence, alternatives[], audio: null }. */
final class SpeechResult {
    static JSObject run(Bundle b) {
        ArrayList<String> list = b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        float[] conf = b.getFloatArray(SpeechRecognizer.CONFIDENCE_SCORES);
        JSArray alt = new JSArray();
        if (list != null) for (String s : list) alt.put(s);
        return new JSObject()
            .put("text", list == null || list.isEmpty() ? "" : list.get(0))
            .put("confidence", conf == null || conf.length == 0 ? -1 : conf[0])
            .put("alternatives", alt)
            .put("audio", JSObject.NULL);
    }
}
