package com.example.lingocards.saf;

import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;
import com.example.lingocards.core.AtomicPlugin;
import com.example.lingocards.core.EncodeBase64;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Системный диалог выбора файла (SAF). → { name, data(base64) } */
@CapacitorPlugin(name = "SafOpen")
public class SafOpenPlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) {
        startActivityForResult(c, OpenableIntent.run(Intent.ACTION_OPEN_DOCUMENT, "*/*"), "onResult");
        return null;
    }

    @ActivityCallback
    private void onResult(PluginCall c, ActivityResult r) {
        settle(c, () -> {
            Uri uri = PickedUri.require(r);
            return new JSObject()
                .put("name", DisplayName.run(getContext(), uri))
                .put("data", EncodeBase64.run(ReadUri.run(getContext(), uri)));
        });
    }
}
