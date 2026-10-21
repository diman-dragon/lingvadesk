# Карта проекта LingvaDesk (читать ПЕРВОЙ — вместо чтения всего кода)

> Версия 1.8.0 · Capacitor 6.2.0 (Android) · JS без сборки (ES-модули) в `www/`, Java-плагины в `android/`.
> Правило кода: **один файл — одна функция** (≤45 строк JS), слои вниз: `actions → study/deckio/backup → repo → native → Java`; `views → components`.
> Обновляй эту карту при каждом изменении структуры (и поднимай версию — см. «Релиз»).

## 1. Что это
Офлайн-флешкарты. Данные: **проект (в БД таблица `languages`) → колода → карточка**. SRS по поведению (без кнопок оценки), режимы: интервальное повторение, карточки, на слух, игра «Блиц», проверка произношения. Импорт/экспорт, бэкап, значок приложения по «не занимались сегодня».

## 2. Где что (по задаче → куда идти)
| Задача | Файлы |
|---|---|
| Новый экран | `views/<имя>View.js` + строка в `views/index.js`; вкладка — `constants/TAB_OF.js`, кольцо — `constants/RING.js`, свайп — `constants/SWIPE_SCREENS.js` |
| Новое действие UI | `actions/<имя>.js` + строка в одном из `actions/{nav,library,study,data}Actions.js`; в HTML `data-act="<имя>"` (`data-on="change"` для input) |
| SQL-запрос | `repo/<имя>.js` (один запрос на файл), вызывает `native/db*` |
| Список ⇄ сетка, страницы | `components/entry` (→ `navItem` / `navTile`), `pagedList`, `layoutToggle`, `pager/*`, `constants/PAGER` (размеры = CSS `.item`/`.gtile`) |
| Вкладки / нижняя панель | `constants/TABS`, `components/tabBar`, `nav/render` |
| Навигация, «Назад», свайпы по кольцу | `nav/*` (`go`, `popBack`, `systemBack`, `swipeNavigate`, `switchRing`), `gestures/*`, `events/*` |
| Учёба: режимы и выбор колоды | `views/studyHubView`, `components/modeEntry`, `constants/MODE_INFO`, `components/deckSheet`, `actions/{openSheet,closeSheet,startStudy}` |
| Сессия учёбы | `study/*` (`openStudy`, `startSession`, `buildOrder`, `gradeCard`, `track*`, `makeQuiz`), `views/sessionView` + `studyFace/listenFace/speakFace` |
| Алгоритм SRS | `srs/*` (`nextSrs`, `nextInterval`, `nextEase`, `inferGrade`, `calibrate`, `speechGrade`) |
| Игра | `game/*`, `views/gameView`, таблица `games` |
| Произношение | `actions/record` → `native/speechListen` → `speech/*.java`; `study/scoreSpeech`, `srs/speechGrade`, таблица `pronunciations` |
| Статистика | `views/stats*` ← `repo/list*`, `study/{retention,dayBars,forecastBars,gradeSplit,medianTimes,streaks}` |
| Импорт/экспорт | `deckio/*` (`readImportFile` → `readImportText`/`readZip` → `saveLibrary`; `exportLibraryToFile`), `views/importFormView`, `actions/{confirmImport,importLibrary,importPaste,exportLibrary}` |
| Бэкап | `backup/*`, `native/backup*`, Java `backup/*` (`.fcbak` = ZIP {manifest, app.db}) |
| Настройки | `views/settingsView`, `settings/*`, `constants/{DEFAULT_PREFS,PREF_OPTIONS}`, `actions/setPref` |
| Стили | один файл `www/css/style.css` (темы, `.item`, `.gtile`, `.sheet`, низкие экраны ≤700/≤600px) |
| Озвучка | `native/ttsSpeak`, `study/autoSpeak`, Java `tts/*`, коды языков `constants/TTS_CODES` |
| Значок приложения | Java `icon/*`, JS `study/syncIcon`, `study/markStudied` |

## 3. Экраны (`state.nav.v`) → файл → вкладка
| v | view | вкладка | ключевое |
|---|---|---|---|
| `library` | libraryView | Библиотека | проекты, список/сетка, страницы |
| `project` | projectView | Библиотека | колоды проекта |
| `deck` | deckView | Библиотека | карточки колоды (тап = правка) |
| `projectForm/deckForm/cardForm` | *FormView | Библиотека | CRUD, перенос; без прокрутки |
| `importForm` | importFormView | Библиотека | сводка импорта → проект + колода |
| `study` | studyHubView | Учёба | **режимы списком/сеткой (с 1.8.0)** + статы дня + план; тап → `deckSheet` (`state.sheet`) |
| `session` | sessionView | Учёба | сама учёба (flip / выбор / ввод / на слух / произношение) |
| `game` | gameView | Учёба | «Блиц» 60 с |
| `stats` | statsView | Статистика | Overview/Grades/Decks/Hard/Speech |
| `settings` | settingsView | Настройки | 4 страницы: Вид · Учёба · Данные · О нас |

Кольцо свайпов: library → study → stats → settings → library. «Назад» — свой стек `state.stack` (`nav/go` кладёт, `nav/popBack` снимает; Android → событие `lingvaBack` → `nav/systemBack`).

## 4. Состояние и данные
- `state/appState.js`: `nav`, `stack`, `session`, `quiz`, `sheet` (режим открытого меню колод), `game`, `speech`, `importDraft`, `page/pager` (постраничный вывод), `prefs`.
- `state.prefs` (из таблицы `settings`): `theme font anim autoplay dir layout check newPerDay sessionMax haptic`. `layout` = `list|grid` — **общий для библиотеки и учёбы**.
- Рендер: `nav/render` → `views[v]()` → HTML-строка → `layoutPager()` делит `state.pager.items` на страницы по реальной высоте. Всё через делегирование: `events/dispatch` по `[data-act]`.
- **SQLite `lingocards.db`, схема v4** (`android/.../db/Schema.java`, миграции `MigrateV2..V4`): `languages`(=проекты: name, tts) · `decks`(language_id) · `cards`(front, back, example, example_tr, ord, due, interval, ease, reps) · `settings`(key,value) · `reviews`(card_id, ts, grade, think, look, fresh, mode, hinted, plays) · `pronunciations` · `games`. Каскадное удаление. Сессия НЕ хранится — очередь строится из `cards` заново.
- Область учёбы: `'all' | 'p:<id>' | 'd:<id>'` (`repo/scopeClause`).

## 5. Учёба в двух словах
Оценка выводится из поведения (`study/track*` → `srs/inferGrade`), `study/gradeCard` пишет в `reviews` и двигает SM-2 (`srs/nextSrs`), `study/undoGrade` — «↶». Лимит новых — `newPerDay` на колоду (`study/loadLimits`, `planInfo`). «Пиявка» — 5 «снова» (`checkLeech`). Режимы `cards`, `listen`, `speak`, `game` расписание не двигают (кроме `srs`).

## 6. Java (`android/app/src/main/java/com/example/lingocards/`)
`core/` (AtomicPlugin и утилиты) · `db/` (Schema, миграции, Db*Plugin) · `saf/` (открыть/сохранить файл) · `backup/` · `tts/` · `speech/` (SpeechRecognizer) · `icon/` (4 activity-alias, будильник 30 мин) · `anki/` (чтение .apkg) · `screen/` (KeepAwake) · `PluginList.java` (регистрация), `MainActivity` + `BackToJs`. Один плагин — одна операция `exec`.

## 7. Проверка и релиз
- `npm test` (Node 22, `node:sqlite`, 110 тестов; UI-сценарии — `test/ui.test.js`, мост подменяет `test/helpers/installBridge.js`) · `npm run check` (атомарность: один export, ≤45 строк, нет осиротевших модулей/битых импортов).
- Версия меняется **в трёх местах разом**: `package.json`, `www/js/constants/APP_VERSION.js`, дефолт в `android/app/build.gradle` (проверяет `test/version.test.js`) + запись в `CHANGELOG.md`. CI (`.github/workflows/android.yml`): тесты → debug APK, по тегу `vX.Y.Z` — подписанный релиз.

## 8. Документы глубже (читать только при необходимости)
`docs/ARCHITECTURE.md` (подробно по экранам/учёбе/жестам) · `CONVENTIONS.md` · `FORMATS.md` (форматы файлов) · `UPDATES.md` · `DECISIONS.md` (слияние с LingoCards) · `CHANGELOG.md` (история по версиям).

## 9. Недавние изменения
- **1.8.0** — вкладка «Учёба»: режимы как элементы списка/сетки с переключателем и страницами (`modeEntry`, `lead` в `navItem/navTile`; `modeTile` удалён; `openSheet` берёт режим из `data-id`).
- 1.7.1 — ошибка распознавания 13, пакеты языков, перенос текста; 4 вкладки. 1.7.0 — значок-предупреждение, игра «Блиц», расширенный импорт.
