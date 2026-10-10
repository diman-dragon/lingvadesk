package com.example.lingocards.saf;

import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;
import com.example.lingocards.core.AtomicPlugin;
import com.example.lingocards.core.DecodeBase64;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Системный диалог «Сохранить как» (SAF). Вход: { name, mime, data(base64) } */
@CapacitorPlugin(name = "SafSave")
public class SafSavePlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) {
        Intent i = OpenableIntent.run(Intent.ACTION_CREATE_DOCUMENT, c.getString("mime", "application/octet-stream"));
        i.putExtra(Intent.EXTRA_TITLE, c.getString("name", "file"));
        startActivityForResult(c, i, "onResult");
        return null;
    }

    @ActivityCallback
    private void onResult(PluginCall c, ActivityResult r) {
        settle(c, () -> {
            Uri uri = PickedUri.require(r);
            WriteUri.run(getContext(), uri, DecodeBase64.run(c.getString("data", "")));
            return new JSObject();
        });
    }
}
