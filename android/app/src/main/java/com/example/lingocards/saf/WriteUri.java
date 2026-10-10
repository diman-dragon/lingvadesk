package com.example.lingocards.saf;

import android.content.Context;
import android.net.Uri;
import java.io.OutputStream;

public final class WriteUri {
    public static void run(Context ctx, Uri uri, byte[] data) throws Exception {
        try (OutputStream out = ctx.getContentResolver().openOutputStream(uri, "wt")) { out.write(data); out.flush(); }
    }
}
