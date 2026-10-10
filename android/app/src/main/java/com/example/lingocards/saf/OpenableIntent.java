package com.example.lingocards.saf;

import android.content.Intent;

public final class OpenableIntent {
    public static Intent run(String action, String mime) {
        Intent i = new Intent(action);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType(mime);
        return i;
    }
}
