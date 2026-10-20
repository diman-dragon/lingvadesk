package com.example.lingocards.anki;

import com.example.lingocards.core.AtomicPlugin;
import com.example.lingocards.core.DecodeBase64;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Чтение колоды Anki (.apkg): JS распаковывает zip и присылает SQLite-коллекцию (base64), плагин возвращает { notes: [[поля]] }. */
@CapacitorPlugin(name = "AnkiNotes")
public class AnkiNotesPlugin extends AtomicPlugin {
    @Override protected JSObject handle(PluginCall c) throws Exception {
        return new JSObject().put("notes", AnkiNotes.run(getContext(), DecodeBase64.run(c.getString("data", ""))));
    }
}
