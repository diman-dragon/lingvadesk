# Карта проекта LingvaDesk (читать ПЕРВОЙ — вместо чтения всего кода)

> Версия 2.0.0 · Capacitor 6.2.0 (Android) · JS без сборки (ES-модули) в `www/`, Java-плагины в `android/`.
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
| Учёба: режимы и выбор колоды | `views/studyHubView`, `components/modeEntry`, `constants/MODE_INFO`, `actions/openMode` → `views/studyDecksView` (`components/deckEntry`, `study/{planInfo,sumDecks,groupProjects}`, `actions/openProjectDecks`) → `actions/{pickScope,startStudy}` |
| «На слух» с вариантами | `study/makeQuiz` (listen → всегда `choice`), `views/listenFace`, `quizControls`, `actions/pick` |
| Сессия учёбы | `study/*` (`openStudy`, `startSession`, `buildOrder`, `gradeCard`, `track*`, `makeQuiz`), `views/sessionView` + `studyFace/listenFace/speakFace` |
| Алгоритм SRS | `srs/*` (`nextSrs`, `nextInterval`, `nextEase`, `inferGrade`, `calibrate`, `speechGrade`) |
| Диалоги | `docs/DIALOGS.md`; ход сцены `dialog/*`, экраны `views/dialog*`, действия `actions/dialog*`, импорт `deckio/parseDialogText`, примеры `constants/SAMPLE_DIALOGS` + `examples/` |
| Игры | категория: `views/gamesView` (`constants/GAMES`, `components/gameEntry`, `actions/openGameKind`); «Блиц» — `game/*`, `views/gameView`; «Квест» — `game/{newQuest,answerQuest,submitQuest,finishQuest,openQuest}`, `views/quest{View,Controls,Result}`, `components/trail*`, `actions/quest*`; таблица `games` (у квеста `scope` с префиксом `quest:`) |
| Произношение | `actions/record` → `native/speechListen` → `speech/*.java`; `study/scoreSpeech`, `srs/speechGrade`, таблица `pronunciations` |
| Статистика | `views/statsView` собирает данные → `stats/index.js` (12 параметров: today, streak, retention, learned, grades, modes, timing, decks, hard, forecast, speech, weak; каждый → `{icon,title,value,sub,detail}`) → элементы `entry` + окно `components/statSheet`; вычисления — `study/{retention,dayBars,forecastBars,gradeSplit,medianTimes,streaks}`, SQL — `repo/list*` |
| Нижние окна (sheet) | `components/sheetShell` (общая оболочка), `statSheet` (параметр статистики); открыто окно статистики — `state.sheet = 'stat:<n>'`, закрывает `closeSheet`/«Назад» |
| Сводка на карточке учёбы | `components/studyInfo` (всего · изучено · сегодня + красный «?»), `study/loadLevel` + `constants/LOAD_STEPS` (4 градации, CSS `.today.lv0…lv3`), данные — `repo/listDeckStats` (`total fresh due late mature`) |
| Порядок карточек | `study/buildOrder` — всегда случайный (`util/shuffle`, затем устойчивая сортировка по сроку / давности) |
| Текст помещается | `dom/fitFaces` (авто-масштаб `--fit` у `.face`, `zoom` у страницы списка; вызывается из `nav/render`, `pager/layoutPager`, `finishQuiz`, `showText`, `record`), `dom/fitOpts` + `components/optGrid` (варианты ответа: всегда сетка 2×2, текст уменьшается, без прокрутки), `components/header` (`long`/`xlong`), CSS `.page` с `minmax(0,1fr)`; **проверка в браузере — `tools/qa-layout/`** (после правок CSS/вёрстки запускать) |
| Тап по кнопке / свайп | `gestures/*`: метка `swipe.suppress` (время) гасит клик только `SWIPE.suppressMs` после жеста — иначе съедала следующее нажатие |
| Импорт/экспорт | `deckio/*` (`readImportFile` → `readImportText`/`readZip` → `saveLibrary`; `exportLibraryToFile`), `views/importFormView`, `actions/{confirmImport,importLibrary,importPaste,exportLibrary}` |
| Бэкап | `backup/*`, `native/backup*`, Java `backup/*` (`.fcbak` = ZIP {manifest, app.db}) |
| Настройки | `views/settingsView`, `settings/*`, `constants/{DEFAULT_PREFS,PREF_OPTIONS}`, `actions/setPref` |
| Стили | один файл `www/css/style.css` (темы, `.item`, `.gtile`, `.sheet`, низкие экраны ≤700/≤600px) |
| Озвучка | `tts/speakText` (голос слота, скорость, высота) → `native/ttsSpeak`, `study/autoSpeak`, Java `tts/*`, коды языков `constants/TTS_CODES`; выбор голоса — `views/voicePage`, `components/voiceRow`, `tts/{resolveVoice,voicesFor,voiceLabel,loadVoiceList}`, `settings/loadVoices`, `constants/SPEAKERS` |
| Значок приложения | Java `icon/*`, JS `study/syncIcon`, `study/markStudied` |

## 3. Экраны (`state.nav.v`) → файл → вкладка
| v | view | вкладка | ключевое |
|---|---|---|---|
| `library` | libraryView | Библиотека | проекты, список/сетка, страницы |
| `project` | projectView | Библиотека | колоды проекта |
| `deck` | deckView | Библиотека | карточки колоды (тап = правка) |
| `projectForm/deckForm/cardForm` | *FormView | Библиотека | CRUD, перенос; без прокрутки |
| `importForm` | importFormView | Библиотека | сводка импорта → проект + колода |
| `study` | studyHubView | Учёба | режимы списком/сеткой + статы дня + план; на каждом режиме сводка (всего/изучено/сегодня, 4 цвета, красный «?» при просрочке); тап → экран `studyDecks` |
| `studyDecks` | studyDecksView | Учёба | область выбранного режима (`state.nav.mode`), сгруппировано по проектам: без `nav.project` — «Все колоды» + проекты (тап → `openProjectDecks`); с `nav.project` — «Весь проект» + колоды; тап по области → `pickScope` → `startStudy` (`all`/`p:<id>`/`d:<id>`) |
| `session` | sessionView | Учёба | сама учёба (flip / выбор / ввод / на слух / произношение) |
| `games` | gamesView | Учёба | категория «Игры»: Блиц, Квест (список/сетка, рекорды); тап → `studyDecks` с `mode: blitz\|quest` |
| `dialog` | dialogView | Учёба | сцена диалога: настройка ролей → чат реплик с озвучкой → итог; `studyDecks` с `mode: dialog` показывает только колоды-диалоги |
| `game` | gameView | Учёба | «Блиц» 60 с |
| `quest` | questView | Учёба | «Квест»: тропинка с героем, 3 жизни, выбор / ввод |
| `stats` | statsView | Статистика | 12 параметров списком/сеткой, тап → подробное окно (`state.sheet='stat:<n>'`) |
| `settings` | settingsView | Настройки | 7 страниц: Вид · Учёба · Голос · Языки · Лимиты · Данные · О нас |

Кольцо свайпов: library → study → stats → settings → library. «Назад» — свой стек `state.stack` (`nav/go` кладёт, `nav/popBack` снимает; Android → событие `lingvaBack` → `nav/systemBack`).

## 4. Состояние и данные
- `state/appState.js`: `nav`, `stack`, `session`, `quiz`, `sheet` (режим открытого меню колод), `game`, `speech`, `importDraft`, `page/pager` (постраничный вывод), `prefs`.
- `state.prefs` (из таблицы `settings`): `theme font anim autoplay dir layout check newPerDay sessionMax haptic`. `layout` = `list|grid` — **общий для библиотеки и учёбы**.
- Рендер: `nav/render` → `views[v]()` → HTML-строка → `layoutPager()` делит `state.pager.items` на страницы по реальной высоте. Всё через делегирование: `events/dispatch` по `[data-act]`.
- **SQLite `lingocards.db`, схема v5** (`android/.../db/Schema.java`, миграции `MigrateV2..V5`): `languages`(=проекты: name, tts) · `decks`(language_id, kind: cards|dialog) · `cards`(front, back, example, example_tr, ord, due, interval, ease, reps, speaker) · `settings`(key,value) · `reviews`(card_id, ts, grade, think, look, fresh, mode, hinted, plays) · `pronunciations` · `games`. Каскадное удаление. Сессия НЕ хранится — очередь строится из `cards` заново.
- Область учёбы: `'all' | 'p:<id>' | 'd:<id>'` (`repo/scopeClause`).

## 5. Учёба в двух словах
Оценка выводится из поведения (`study/track*` → `srs/inferGrade`), `study/gradeCard` пишет в `reviews` и двигает SM-2 (`srs/nextSrs`), `study/undoGrade` — «↶». Лимит новых — `newPerDay` на колоду (`study/loadLimits`, `planInfo`). «Пиявка» — 5 «снова» (`checkLeech`). Режимы `cards`, `listen`, `speak`, `game` расписание не двигают (кроме `srs`).

## 6. Java (`android/app/src/main/java/com/example/lingocards/`)
`core/` (AtomicPlugin и утилиты) · `db/` (Schema, миграции, Db*Plugin) · `saf/` (открыть/сохранить файл) · `backup/` · `tts/` · `speech/` (SpeechRecognizer) · `icon/` (4 activity-alias, будильник 30 мин) · `anki/` (чтение .apkg) · `screen/` (KeepAwake) · `PluginList.java` (регистрация), `MainActivity` + `BackToJs`. Один плагин — одна операция `exec`.

## 7. Проверка и релиз
- `tools/qa-layout/all.sh` — проверка вёрстки в Chromium (длинные тексты, все экраны; см. README рядом).
- `npm test` (Node 22, `node:sqlite`, 114 теста; UI-сценарии — `test/ui.test.js`, мост подменяет `test/helpers/installBridge.js`) · `npm run check` (атомарность: один export, ≤45 строк, нет осиротевших модулей/битых импортов).
- Версия меняется **в трёх местах разом**: `package.json`, `www/js/constants/APP_VERSION.js`, дефолт в `android/app/build.gradle` (проверяет `test/version.test.js`) + запись в `CHANGELOG.md`. CI (`.github/workflows/android.yml`): тесты → debug APK, по тегу `vX.Y.Z` — подписанный релиз.

## 8. Документы глубже (читать только при необходимости)
`docs/ARCHITECTURE.md` (подробно по экранам/учёбе/жестам) · `CONVENTIONS.md` · `FORMATS.md` (форматы файлов) · `UPDATES.md` · `DECISIONS.md` (слияние с LingoCards) · `CHANGELOG.md` (история по версиям).

## 9. Недавние изменения
- **2.2.0** — диалоги: сцена = колода `kind='dialog'`, реплика = карточка с `speaker` 1…3 (БД v5, `MigrateV5`); режим «💬 Диалоги» (`dialog/*`, `views/dialog{View,Roles,Chat,Controls,Done}`, `actions/dialog*`, `state.dialog`): роли 1 и 2 озвучены голосами слотов 1 и 2, роль 3 — вы (микрофон + оценка); Java `TtsSay`/`TtsProgress` — `wait` (ответ при окончании реплики); импорт текста `A: фраза | перевод` (`deckio/parseDialogText`), примеры `examples/dialogs.json`, `dialog-cafe.txt`, `constants/SAMPLE_DIALOGS`, подробности — `docs/DIALOGS.md`.
- **2.2.0** — голоса: только локальные, группы по полу, имена-ярлыки (`tts/{voiceGender,voiceLabels,voicesFor}`, `components/voiceRow`); страница настроек «Языки» (`views/langPage`, `components/langRow`, `actions/{installVoices,checkSpeechLang}`, Java `TtsInstall`, `tts/speechStatus`): скачивание голосов и пакетов распознавания из приложения.
- **2.2.0** — «Квест»: тропинка с героем (`components/{trail,trailPoints}`, `dom/walkHero`, `QUEST.heroes/trail`; герой идёт к узлу после ответа — `quest.walking`).
- **2.0.0** — голоса озвучки: страница настроек «Голос» (`views/voicePage`, `components/voiceRow`, `tts/*`, `actions/{setVoice,testVoice,refreshVoices}`), Java `TtsVoices` + голос/скорость/высота в `TtsSay`; выбор хранится как `voice:<язык>:<слот>` в `settings` (`state.voices`), слоты — `constants/SPEAKERS` (база под диалоги); `speakText(text, lang, slot)`.
- **2.0.0** — игры в одной категории «Игры» (`views/gamesView`, `components/gameEntry`, `constants/GAMES`, `actions/openGameKind`; режим `game` на хабе → экран `games` → `studyDecks` с `mode: blitz|quest`) и новая игра «Квест» (`game/*Quest`, `views/quest*`, `constants/QUEST`, `state.quest`; рекорд — `bestScore('quest')`, префикс `quest:` в `games.scope`).
- **2.0.0** — варианты ответа («На слух», игра): всегда сетка 2×2 фиксированной высоты, без столбца и прокрутки; текст каждого варианта уменьшается, если большой (`dom/fitOpts`, `components/optGrid`).
- **1.9.4** — убраны «Все колоды»/«Весь проект»; проверка вёрстки в Chromium (`tools/qa-layout`) и исправления: варианты ответа в «На слух»/игре не сжимают карточку, автоподгонка текста, длинные слова/заголовки.
- **1.9.3** (вместо нереализованной 1.10.0) — тап по режиму в «Учёбе» открывает экран области режима: «Все колоды» + проекты → колоды проекта; список/сетка с информацией; `deckSheet`/`openSheet` удалены.
- **1.9.1** — «На слух»: всегда выбор из 4 переводов (`study/makeQuiz`: для `listen` принудительно `choice` + направление `fwd`; лицо — `views/listenFace`, кнопки — `views/quizControls`, ответ — `actions/pick` → `study/finishQuiz`).
- **1.9.0** — исправлены «залипающие» нажатия кнопок звука/микрофона/тестов (устаревшая метка подавления клика после свайпа); порядок карточек в учёбе случайный; сводка на карточках учёбы; статистика — список/сетка + подробные окна (`stats/*`, `statSheet`, `sheetShell`, `openStat`); `late` в `listDeckStats`; старые `views/stats{Overview,Grades,Decks,Hard,Speech}` удалены; в конвенции п.0 «читать карту».
- **1.8.0** — вкладка «Учёба»: режимы как элементы списка/сетки с переключателем и страницами (`modeEntry`, `lead` в `navItem/navTile`; `modeTile` удалён; `openSheet` берёт режим из `data-id`).
- 1.7.1 — ошибка распознавания 13, пакеты языков, перенос текста; 4 вкладки. 1.7.0 — значок-предупреждение, игра «Блиц», расширенный импорт.
