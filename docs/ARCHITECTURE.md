# Архитектура

**Термины.** Курс → Колода → Карточка. В БД курс хранится в таблице `languages` (имя сохранено ради обновления поверх без миграции); в коде и интерфейсе — «курс» (`course`). Ключ `language` в файле `deck.json` — это курс.

## Структура
```
www/js/
  main.js → boot.js            точка входа
  constants/  state/  util/  dom/
  native/     обёртки над плагинами (dbQuery, dbRun, dbBatch, dbFirst, safOpen, safSave, backupCreate, backupRestore, ttsSpeak)
  repo/       по одному SQL-запросу на файл
  settings/   loadPrefs, savePref, setSetting, applyPrefs, resolveTheme
  srs/        nextSrs, nextInterval, nextEase, previewLabel
  study/      startSession, buildOrder, mergeNewCards, loadSavedState, saveState, currentCard, movePos,
              restartSession, gradeCard, studyStep, openStudy, showGrades, autoSpeak,
              restoreOrder, introCount, isIntro, progressOf
  deckio/     parseDeck, isValidCard, normalizeCard, findOrCreateLanguage, saveParsedDeck, importDeckFromFile,
              buildDeckJson, exportDeckToFile
  backup/     createBackup, restoreBackup
  tts/        speakText
  components/ мелкие HTML-генераторы (button, row, header, navItem, faceBox …)
  views/      экраны (today, library, course, deck, study, settings, courseForm, deckForm, cardForm) + index.js
  nav/        go (history.pushState), goBack, parentOf, render (экран + нижнее меню + анимация)
  gestures/   onPointerDown/Move/Up/Cancel, flyOut, springBack, consumeSuppress, swipeState — свайпы карточки
  actions/    по одному действию на файл + index.js
  events/     dispatch (единая точка data-act/data-on), bindEvents, handlePopState (кнопка «Назад»), watchSystemTheme

android/app/src/main/java/com/example/flashcards/
  core/    AtomicPlugin, Task, Cancelled, ReadStream/ReadFile/WriteFile/CopyFile, Encode/DecodeBase64, JsonToArgs/Strings
  db/      DbHelper, Schema, CreateSchema, DbHolder, GetDb, CloseDb, DbFile, DeleteSidecars, RowToJson,
           QueryRows, RunSql, RunBatch, Db{Query,Run,Batch}Plugin
  saf/     OpenableIntent, PickedUri, DisplayName, ReadUri, WriteUri, SafOpenPlugin, SafSavePlugin
  backup/  Fcbak, BuildManifest, BuildFcbak, ZipPut, ReadFcbak, ParsedFcbak, CheckManifest, IsValidDb,
           MakeSafetyCopy, SwapDb, RollbackDb, RestoreDb, BackupCreatePlugin, BackupRestorePlugin
  tts/     TtsHolder, TtsInit, TtsSay, TtsStop, TtsSpeakPlugin, TtsStopPlugin
  PluginList, MainActivity
```
Мост: `Capacitor.registerPlugin('<Имя>').exec({...})`. Имена: DbQuery, DbRun, DbBatch, SafOpen, SafSave,
BackupCreate, BackupRestore, TtsSpeak, TtsStop.

## Модель данных (SQLite `lingocards.db`, user_version = 1)
| Таблица | Назначение |
|---|---|
| `languages(id, name UNIQUE, tts)` | язык и BCP-47 код голоса |
| `decks(id, language_id→languages, name, created)` | колоды (ON DELETE CASCADE) |
| `cards(id, deck_id→decks, front, back, example, example_tr, ord, due, interval, ease, reps)` | карточки + SRS |
| `deck_state(deck_id, mode, pos, order_json) PK(deck_id,mode)` | позиция и порядок (в т.ч. shuffle) |
| `settings(key, value)` | тема, направление |

WAL выключен → БД всегда один файл.

## Обучение
- `learn` («Обучение») — пачка из 10 новых карточек (`isNewCard`: reps=0, interval=0, due=0). Порядок = [знакомство ×N, проверка ×N]:
  в знакомстве обе стороны, пример и озвучка, без оценок; в проверке — обычный переворот и 4 оценки («Снова» возвращает карточку в конец).
  В `deck_state.order_json` хранится `{order, intro}`; завершённая пачка заменяется следующей.
- `seq` — по `ord`; `shuffle` — порядок создаётся один раз и хранится в `order_json` (продолжение после перезапуска); новые карточки дописываются в конец (`mergeNewCards`).
- `srs` — очередь карточек с `due <= now`, собирается заново каждую сессию; «Снова» возвращает карточку в конец.
- `nextSrs` (упрощённый SM-2, 4 оценки): `again` → `reps=0, interval=0, ease−0.2`, повтор через 10 минут и возврат в конец текущей очереди;
  новая карточка: `hard/good` → 1 день, `easy` → 4; вторая: `hard` 3, `good` 6, `easy` 8 дней;
  далее `interval×m`, где `m` = 1.2 (hard) / ease (good) / ease×1.3 (easy), минимум `interval+1`;
  `hard` → `ease−0.15`, `easy` → `ease+0.15`, ease ≥ 1.3. Оценки обновляют SRS во всех режимах.
- Направление: `fwd` — вопрос `front`, ответ `back`; `rev` — наоборот. Озвучиваются `front` и `example` голосом языка.

## Backup / restore
`BuildFcbak`: ZIP {manifest.json, app.db}. `RestoreDb`: запись во временный файл → `IsValidDb` (integrity_check + 5 таблиц) →
`MakeSafetyCopy` (`files/backups/pre-restore-<ts>.db`) → `SwapDb` (замена + повторная проверка) → при любой ошибке `RollbackDb`.

## Тесты
`npm test` (Node 22, `node:sqlite`): `nextSrs.test.js` (алгоритм), `deckio.test.js` (импорт/экспорт, круговой тест),
`study.test.js` (позиции режимов, shuffle, новые карточки, SRS-очередь, счётчики, каскады). Мост Capacitor подменяется
`test/helpers/installBridge.js`; схема берётся из `Schema.java`, поэтому тесты работают с реальной схемой приложения.

## Интерфейс
- **Навигация:** нижнее меню (Сегодня · Библиотека · Настройки) на экранах верхнего уровня (`constants/TABS`, `TAB_OF`);
  на экране обучения меню скрыто. Системная кнопка «Назад» работает через `history.pushState` / `popstate`.
- **Сегодня:** статистика (к повторению / всего / выучено), колоды к повторению с запуском SRS одним тапом.
- **Переворот карточки:** обе стороны всегда в DOM (`components/flipFaces`), переворот — CSS 3D через класс `flipped`
  (`actions/flip` → `dom/toggleFlip`, без перерисовки, иначе анимация не сработает). Переворачивать можно сколько угодно раз;
  оценки появляются при первом открытии ответа и остаются. Новая карточка въезжает анимацией `card-in`.
  Под кнопками оценок — подпись, когда карточка вернётся (`srs/previewLabel`).
- **Настройки** (`state.prefs`, таблица `settings`): тема (системная/светлая/тёмная), размер текста, анимации, направление,
  автоозвучка. Одна универсальная операция `actions/setPref` (`data-key`, `data-v`); применяются через атрибуты
  `data-theme/font/anim` на `<html>`. Там же: backup/restore, сброс прогресса, о приложении.

## Цвета и иконка
- Светлая тема «Бумага»: тёплый кремовый фон `#f3eee3`, чернильный текст, бирюзовый акцент `#0b8f7e → #19b894`.
- Тёмная тема **AMOLED**: чистый `#000`, мятный неон `#35e0b8 → #8af5dc`, глубина — тонкие рамки вместо теней.
- Токены — в начале `www/css/style.css` (`:root` и `:root[data-theme=dark]`), тема 'auto' разрешается в JS (`settings/resolveTheme`).
- Иконка: `assets/icon.svg` (исходник), `assets/icon-512.png`; Android — adaptive-вектор (`drawable/ic_launcher_*.xml`,
  включая монохромный слой для тем Android 13+) и PNG для старых устройств (`mipmap-*`).

## CRUD и библиотека
- Каждая сущность редактируется на своём экране-форме (`courseForm`, `deckForm`, `cardForm`): создать, изменить, удалить; колоду можно перенести в другой курс, карточку — в другую колоду.
  Кнопка «Назад»/«Отмена»/«Сохранить» идут по истории браузера (`nav/goBack`), без истории — на родителя (`nav/parentOf`).
- `components/entry` рисует элемент библиотеки списком (`navItem`) или сеткой (`navTile`) по настройке `layout`; одна и та же настройка действует для курсов, колод и карточек.

## Жесты
Свайп по карточке: влево — следующая (`actions/skip`), вправо — предыдущая (`actions/prev`, анимация `card-back`); порог 80 px, меньше — карточка возвращается.
Клик, порождённый свайпом, гасится (`gestures/consumeSuppress`); кнопки внутри карточки жест не начинают; вертикальное движение — прокрутка.
