package com.example.lingocards.core;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

public final class ReadFile {
    public static byte[] run(File f) throws IOException {
        try (InputStream in = new FileInputStream(f)) { return ReadStream.run(in); }
    }
}
