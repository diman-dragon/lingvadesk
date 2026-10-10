package com.example.lingocards.core;

import java.io.File;
import java.io.IOException;

public final class CopyFile {
    public static void run(File from, File to) throws IOException { WriteFile.run(to, ReadFile.run(from)); }
}
