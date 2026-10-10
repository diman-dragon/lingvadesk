package com.example.lingocards.saf;

import android.content.Context;
import android.net.Uri;
import com.example.lingocards.core.ReadStream;
import java.io.InputStream;

public final class ReadUri {
    public static byte[] run(Context ctx, Uri uri) throws Exception {
        try (InputStream in = ctx.getContentResolver().openInputStream(uri)) { return ReadStream.run(in); }
    }
}
