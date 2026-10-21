# Правила кода

1. **Сначала читай `docs/PROJECT_MAP.md`** (карта: где что и когда) — целиком проект не читать, открывать только нужные файлы из карты; это экономит токены. После изменений — обновить карту.
2. **Один файл — одна функция** (JS: ровно один `export`; Java: один класс с одной операцией).
   Исключения, продиктованные фреймворком: `DbHelper` (колбэки SQLiteOpenHelper), `AtomicPlugin` (exec + settle).
3. **Каждый модуль где-то используется** (`npm run check` ловит «осиротевшие» файлы).
4. **Без god-файлов**: JS ≤ 45 строк, Java ≤ 60 строк на файл.
5. **Без дублирования**: общее выносится в отдельный файл (`dbFirst`, `button`, `row`, `studyStep`, `settle`, `OpenableIntent` …).
6. **Один плагин — одна операция**: у каждого Java-плагина единственный метод `exec` (наследуется от `AtomicPlugin`).
7. **Слои** (зависимости только вниз): `actions → study/deckio/backup → repo → native → Java plugin`; `views → components`.
8. Константы и состояние — в `constants/`, `state/`, `*Holder`.

Правила 2–3 и корректность импортов проверяет `npm run check` → `node scripts/check-atomicity.mjs` (запускается в CI).

## Как добавить…
- **Действие UI**: файл `actions/<имя>.js` + строка в `actions/index.js`; в разметке `data-act="<имя>"` (`data-on="change"` для input/select).
- **Экран**: `views/<имя>View.js` + строка в `views/index.js`.
- **SQL-запрос**: файл в `repo/`.
- **Нативную операцию**: Java-класс-плагин (extends `AtomicPlugin`) + строка в `PluginList` + обёртка в `native/`.
