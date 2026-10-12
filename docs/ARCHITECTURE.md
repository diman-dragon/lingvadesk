# Архитектура LingvaDesk

**Модель.** Проект (язык, даты — что угодно) → Колода → Карточка. В БД проект хранится в таблице `languages`
(имя сохранено ради обновления поверх без миграции), в коде и интерфейсе — «проект» (`project`).

## Экраны и навигация
| Экран | Где | Назначение |
|---|---|---|
| `library` | вкладка «Библиотека» | проекты; **импорт и экспорт всей библиотеки** — только здесь |
| `project` → `deck` | библиотека | колоды проекта → карточки колоды (карточки живут только здесь) |
| `projectForm`, `deckForm`, `cardForm` | библиотека | создать / изменить / удалить / перенести |
| `study` | вкладка «Учёба» | область (вся библиотека / проект / колода), статистика, 3 режима |
| `session` | вкладка «Учёба» | сама учёба: интервальное повторение, обучение, повторение |
| `settings` | значок ⚙️ в шапке | 4 страницы: Вид · Учёба · Данные · О нас |

- **Нижняя панель** (Библиотека · Учёба) всегда на экране. Настройки — в шапке.
- **Без прокрутки.** Экран — flex-колонка на всю высоту (`100dvh`). Длинные списки выводятся страницами по высоте области
  (`pager/*`, размеры элементов — `constants/PAGER` и CSS `.item`/`.gtile`), страницы листаются свайпом и точками.
  Формы и карточки компактны; на низких экранах (`≤700px`, `≤600px`) CSS ужимается.
- **«Назад».** Каждый переход — шаг истории (`nav/go` → `pushState`). Системная «Назад» возвращает на шаг назад до библиотеки;
  страж истории (`nav/installBackGuard`, `events/handlePopState`) не даёт выйти из приложения.
- **Кольцо свайпов.** Библиотека → Учёба → Настройки → Библиотека. Свайп листает страницы по кругу; за краем последней страницы
  верхнеуровневого экрана — переход к соседнему (`nav/swipeNavigate`, `nav/switchRing`). Внутри проекта/колоды страницы
  замыкаются сами на себя. В сессии учёбы, на формах свайп по области отключён.
- **Карточки по кругу.** Свайп по карточке: влево — следующая, вправо — предыдущая, после последней — первая (`study/cyclePos`).

## Учёба (`study/`)
- Режимы: `srs` — интервальное повторение (просроченные карточки области); `learn` — обучение: пачка из 10 новых слов,
  знакомство (обе стороны) → проверка с оценками; `review` — простое повторение: все карточки по кругу без оценок,
  по порядку или вперемешку (настройка `shuffle`).
- Сессия `{scope, mode, shuffle, key, map, order, pos, phase, total}`; область — `'all' | 'p:<id>' | 'd:<id>'` (`repo/scopeClause`).
  Оценённая карточка уходит из очереди, «Снова» — в конец. Позиция хранится в таблице `settings` по ключу
  `session:<область>:<режим>` (SRS каждый раз собирается заново).
- Формулы `srs/nextSrs`: again → 10 минут; good/hard/easy → интервалы SM-2; ease ≥ 1.3. Подпись «когда вернётся» — `srs/previewLabel`.
- Переворот — CSS 3D (`components/flipFaces`, `dom/toggleFlip`), без перерисовки; сколько угодно раз.

## Структура кода
```
www/js/
  main.js → boot.js        точка входа
  constants/ state/ util/ dom/
  native/                  обёртки над плагинами (db*, saf*, backup*, ttsSpeak, ttsStop)
  repo/                    по одному SQL-запросу на файл
  settings/                loadPrefs, savePref, setSetting, getSetting, applyPrefs, resolveTheme
  srs/                     nextSrs, nextInterval, nextEase, previewLabel, isNewCard
  study/                   startSession, buildOrder, restoreOrder, cyclePos, gradeCard, startQuiz, restartSession, …
  deckio/                  parseImport, parseDeck, parseLibrary, saveLibrary, importLibraryFromFile, exportLibraryToFile, …
  pager/                   layoutPager, perPage, pageCount, setPage
  nav/                     go, goBack, parentOf, render, swipeNavigate, switchRing, installBackGuard
  gestures/                onPointer*, finishCardSwipe, finishAreaSwipe, flyOut, springBack, …
  components/ views/       разметка
  actions/                 по одному действию на файл + index.js
  events/                  dispatch, bindEvents, handlePopState, onResize
android/…/java/com/example/lingocards/   плагины Capacitor (core, db, saf, backup, tts)
```
Правила кода — `docs/CONVENTIONS.md`; форматы — `docs/FORMATS.md`; обновление поверх — `docs/UPDATES.md`.

## Данные (SQLite `lingocards.db`, схема v1)
`languages` (проекты), `decks`, `cards` (+ SRS: `due`, `interval`, `ease`, `reps`), `settings` (настройки, область учёбы, позиции сессий),
`deck_state` (устарела, не используется; оставлена ради совместимости резервных копий). WAL выключен: БД — один файл.

## Backup / restore
`BuildFcbak`: ZIP {manifest.json, app.db}. `RestoreDb`: проверка (`IsValidDb`) → защитная копия → замена → проверка → при ошибке откат.

## Тесты
`npm test` (Node 22, `node:sqlite`): алгоритм SRS, сессии (круговое листание, фазы, области), импорт/экспорт библиотеки,
сквозной UI-сценарий (экраны, CRUD, страницы, кольцо свайпов, «Назад», жесты), версия и подпись, иконки.
Мост Capacitor подменяет `test/helpers/installBridge.js`, схема берётся из `Schema.java`.
