package com.example.lingocards.core;

import android.util.Base64;

public final class EncodeBase64 {
    public static String run(byte[] b) { return Base64.encodeToString(b, Base64.NO_WRAP); }
}
