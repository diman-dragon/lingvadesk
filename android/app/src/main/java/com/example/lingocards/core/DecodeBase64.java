package com.example.lingocards.core;

import android.util.Base64;

public final class DecodeBase64 {
    public static byte[] run(String s) { return Base64.decode(s, Base64.DEFAULT); }
}
