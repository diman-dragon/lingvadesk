# Правила кода

1. **Один файл — одна функция** (JS: ровно один `export`; Java: один класс с одной операцией).
   Исключения, продиктованные фреймворком: `DbHelper` (колбэки SQLiteOpenHelper), `AtomicPlugin` (exec + settle).
2. **Каждый модуль где-то используется** (`npm run check` ловит «осиротевшие» файлы).
3. **Без god-файлов**: JS ≤ 45 строк, Java ≤ 60 строк на файл.
4. **Без дублирования**: общее выносится в отдельный файл (`dbFirst`, `button`, `row`, `studyStep`, `settle`, `OpenableIntent` …).
5. **Один плагин — одна операция**: у каждого Java-плагина единственный метод `exec` (наследуется от `AtomicPlugin`).
6. **Слои** (зависимости только вниз): `actions → study/deckio/backup → repo → native → Java plugin`; `views → components`.
7. Константы и состояние — в `constants/`, `state/`, `*Holder`.

Правила 1–2 и корректность импортов проверяет `npm run check` → `node scripts/check-atomicity.mjs` (запускается в CI).

## Как добавить…
- **Действие UI**: файл `actions/<имя>.js` + строка в `actions/index.js`; в разметке `data-act="<имя>"` (`data-on="change"` для input/select).
- **Экран**: `views/<имя>View.js` + строка в `views/index.js`.
- **SQL-запрос**: файл в `repo/`.
- **Нативную операцию**: Java-класс-плагин (extends `AtomicPlugin`) + строка в `PluginList` + обёртка в `native/`.
