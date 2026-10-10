package com.example.lingocards.core;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public final class WriteFile {
    public static void run(File f, byte[] data) throws IOException {
        try (FileOutputStream out = new FileOutputStream(f)) { out.write(data); out.getFD().sync(); }
    }
}
