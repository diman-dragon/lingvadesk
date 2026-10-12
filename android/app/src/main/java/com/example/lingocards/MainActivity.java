package com.example.lingocards;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        for (Class<? extends Plugin> p : PluginList.ALL) registerPlugin(p);
        super.onCreate(savedInstanceState);
    }

    /** «Назад» всегда обрабатывает приложение (шаг назад по экранам; на первом экране — остаёмся). */
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() { BackToJs.run(this); }
}
