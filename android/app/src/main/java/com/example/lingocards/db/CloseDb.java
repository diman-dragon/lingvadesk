package com.example.lingocards.db;

public final class CloseDb {
    public static void run() {
        synchronized (DbHolder.class) {
            if (DbHolder.instance != null) { DbHolder.instance.close(); DbHolder.instance = null; }
        }
    }
}
