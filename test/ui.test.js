import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';

// --- заглушки браузера (до импорта модулей приложения) ---
const app = { innerHTML: '', addEventListener() {} };
const toastEl = { textContent: '', classList: { add() {}, remove() {} } };
const flipEl = { cls: new Set(), classList: { toggle: c => (flipEl.cls.has(c) ? (flipEl.cls.delete(c), false) : (flipEl.cls.add(c), true)) } };
const fields = {};
globalThis.document = {
  documentElement: { dataset: {} },
  querySelector: () => flipEl,
  getElementById: id => id === 'app' ? app : id === 'toast' ? toastEl : (fields[id] ??= { value: '', innerHTML: '' })
};
globalThis.confirm = () => true;
const realRandom = Math.random;
Math.random = () => 0.999999;   // перемешивание → тождественное: порядок карточек в сценариях предсказуем (случайность проверяет отдельный тест)
const bridge = installBridge();

const imp = p => import(`../www/js/${p}`).then(m => m.default);
const { default: boot } = await import('../www/js/boot.js');
const { state } = await import('../www/js/state/appState.js');
const dispatch = await imp('events/dispatch.js');
const systemBack = await imp('nav/systemBack.js');
const isSwipe = await imp('gestures/isSwipe.js');
const swipeNavigate = await imp('nav/swipeNavigate.js');
const loadPrefs = await imp('settings/loadPrefs.js');
const listProjects = await imp('repo/listProjects.js');
const listCards = await imp('repo/listCards.js');
const listAllDecks = await imp('repo/listAllDecks.js');
const insertProject = await imp('repo/insertProject.js');
const insertDeck = await imp('repo/insertDeck.js');
const setSetting = await imp('settings/setSetting.js');
const onPointerDown = await imp('gestures/onPointerDown.js');
const onPointerMove = await imp('gestures/onPointerMove.js');
const onPointerUp = await imp('gestures/onPointerUp.js');
const consumeSuppress = await imp('gestures/consumeSuppress.js');
const { APP_VERSION } = await import('../www/js/constants/APP_VERSION.js');
const currentCard = await imp('study/currentCard.js');
const listReviewsSince = await imp('repo/listReviewsSince.js');
const listPronunciationsSince = await imp('repo/listPronunciationsSince.js');
const onVisibility = await imp('events/onVisibility.js');
const { track } = await import('../www/js/state/trackState.js');

// Время в тестах: wait(мс) «проматывает» часы, чтобы проверять оценку по поведению без реальных пауз.
const realNow = Date.now;
let skew = 0;
Date.now = () => realNow() + skew;
const wait = ms => { skew += ms; };
const DAY = 86400000;

/** Всё, что видит пользователь: экран + текущая страница списка + точки. */
const page = () => app.innerHTML + (app.innerHTML.includes('id="pager"') ? fields.pager.innerHTML + fields.dots.innerHTML : '');
const press = (act, data = {}, el = {}) => dispatch({ type: 'click', target: { closest: () => ({ dataset: { act, ...data }, ...el }) } });
const change = (act, el) => dispatch({ type: 'change', target: { closest: () => ({ dataset: { act, on: 'change' }, ...el }) } });
const setFields = obj => Object.entries(obj).forEach(([k, v]) => (fields[k] = { value: String(v), innerHTML: '' }));
const count = (re, s = page()) => (s.match(new RegExp(re.source, 'g')) || []).length;
const setHeight = h => { fields.pager = { innerHTML: '', clientHeight: h }; };

test.before(() => bridge.reset());

test('запуск: библиотека, четыре вкладки внизу (статистика и настройки — тоже там), шапка без шестерёнки', async () => {
  await boot();
  assert.equal(state.nav.v, 'library');
  assert.match(page(), /Проектов пока нет/);
  assert.match(page(), /<span>Библиотека<\/span>/);
  assert.match(page(), /<span>Учёба<\/span>/);
  assert.match(page(), /<span>Статистика<\/span>/);
  assert.match(page(), /<span>Настройки<\/span>/);
  assert.equal(count(/class="tab( on)?"/), 4);
  assert.equal(count(/class="tab on"/), 1);
  assert.doesNotMatch(app.innerHTML, /<header>(?:(?!<\/header>)[\s\S])*data-act="(goSettings|goStats)"/);   // из шапки убраны
  assert.match(page(), /\+ Проект/);
  assert.doesNotMatch(page(), /data-act="importLibrary"|data-act="exportLibrary"/);   // импорт и экспорт — в настройках
});

test('вкладка «Учёба» без карточек: понятная заглушка, панель на месте', async () => {
  await press('goStudy');
  assert.match(page(), /Здесь пока нет карточек/);
  assert.match(app.innerHTML, /class="tabs"/);
  await press('goLibrary');
});

test('импорт на самом верхнем уровне: проект → колода → карточки', async () => {
  bridge.io.picked = deckFile();
  await press('importLibrary');
  assert.match(toastEl.textContent, /проектов 1, колод 1, новых карточек 8/);
  assert.match(page(), /English/);
  assert.match(page(), /колод: 1/);
  assert.doesNotMatch(page(), /class="badge"/);                 // новые карточки ещё не «к повторению»
  await press('importLibrary');
  assert.match(toastEl.textContent, /новых карточек 0/);       // повторный импорт не дублирует
});

test('цепочка проект → колода → карточки; карточки видны только в библиотеке', async () => {
  const pid = (await listProjects())[0].id;
  await press('goProject', { id: pid });
  assert.match(page(), /Basics/);
  assert.match(page(), /Basics<\/span><span class="mark new">новых 8<\/span>/);   // метка по данным учёбы рядом с названием
  assert.doesNotMatch(page(), /Учить/);
  assert.equal(count(/data-act="editDeck"/), 1);                  // ✎ и 🗑 на каждой колоде
  assert.equal(count(/data-act="delDeck"/), 1);
  assert.doesNotMatch(app.innerHTML, /<header>.*data-act="editProject"/);   // из шапки карандаш убран
  await press('goDeck', { id: 1 });
  assert.match(page(), /apple/);
  assert.match(page(), /English · 8 карточек · повторить 0 · новых 8/);
  assert.ok(count(/data-act="delCard"/) > 0);                    // у каждой карточки 🗑, а ✎ дублирует тап по строке
  assert.equal(count(/data-act="editCard"/), 2 * count(/data-act="delCard"/));
  assert.match(page(), /class="mark new">новая/);
  assert.match(page(), /\+ Карточка/);
  assert.match(app.innerHTML, /data-act="goSettings"/);
  await press('goStudy');
  assert.doesNotMatch(page(), /apple|яблоко/);                  // на вкладке «Учёба» списка карточек нет
});

test('библиотека: список ⇄ сетка на всех уровнях', async () => {
  await press('goLibrary');
  assert.match(page(), /class="page "/);
  assert.match(page(), /class="item"/);
  await press('toggleLayout');
  assert.match(page(), /class="page grid /);
  assert.match(page(), /class="gtile"/);
  await press('goProject', { id: 1 });
  assert.match(page(), /class="gtile"/);
  await press('goDeck', { id: 1 });
  assert.match(page(), /class="gtile mini"/);
  await press('toggleLayout');
  assert.match(page(), /class="item"/);
});

test('кнопка сразу после свайпа, не давшего клика, не теряется', async () => {
  const { swipe } = await import('../www/js/gestures/swipeState.js');
  const consume = await imp('gestures/consumeSuppress.js');
  swipe.suppress = Date.now();
  assert.equal(consume(), true);                                  // клик сразу после жеста гасится
  assert.equal(consume(), false);                                 // и только один раз
  swipe.suppress = Date.now() - 1000;                             // жест был давно, клика не было
  assert.equal(consume(), false);                                 // следующее нажатие кнопки проходит
});

test('учёба: «Давай-ка поучим…» — режимы; нажатие на режим раскрывает меню колод; план дня', async () => {
  await press('goStudy');
  assert.equal(count(/class="tab on"/), 1);
  assert.match(page(), /Давай-ка поучим/);
  for (const t of ['к повторению', 'новых', 'сегодня', 'дней подряд', 'Интервальное повторение', 'Карточки', 'На слух', 'Игра', 'Проверка произношения', 'По плану на сегодня: 8']) assert.match(page(), new RegExp(t));
  assert.doesNotMatch(page(), /Обучение|Случайная колода|Что учим|Порядок карточек/);
  assert.equal(count(/data-act="openSheet"/), 5);
  assert.equal(count(/class="sinfo"/), 5);                      // на каждом режиме: всего · изучено · сегодня
  assert.match(page(), /всего <b>8<\/b>/);
  assert.match(page(), /изучено <b>0<\/b>/);
  assert.match(page(), /class="today lv1">сегодня <b>8<\/b>/);
  assert.doesNotMatch(page(), /class="late"/);
  assert.doesNotMatch(page(), /class="sheet"/);
  await press('openSheet', { id: 'srs' });                     // выпадающее меню колод
  assert.equal(state.sheet, 'srs');
  assert.match(page(), /class="sheet"/);
  for (const t of ['Интервальное повторение', 'Все колоды', 'Basics', 'English · повторить 0 · новых 8']) assert.match(page(), new RegExp(t));
  assert.equal(count(/data-act="startStudy"/), 2);                // «Все колоды» и колода
  await systemBack();                                            // «Назад» сначала закрывает меню
  assert.equal(state.sheet, null);
  assert.equal(state.nav.v, 'study');
  await press('openSheet', { id: 'listen' });
  assert.match(page(), /English · карточек 8/);
  await press('closeSheet');
  assert.doesNotMatch(page(), /class="sheet"/);
  await press('startStudy', { mode: 'srs', scope: 'p:999' });     // нет такой области: пустая очередь не открывается
  assert.equal(state.nav.v, 'study');
  assert.match(toastEl.textContent, /нет карточек/);
});

test('карточка учёбы: 4 градации «сегодня» и красный «?» при просрочке', async () => {
  const loadLevel = await imp('study/loadLevel.js');
  assert.deepEqual([0, 1, 10, 11, 30, 31, 500].map(loadLevel), [0, 1, 1, 2, 2, 3, 3]);
  const studyInfo = await imp('components/studyInfo.js');
  assert.doesNotMatch(studyInfo({ total: 5, learned: 2, left: 0, late: 0 }), /class="late"/);
  assert.match(studyInfo({ total: 5, learned: 2, left: 0, late: 0 }), /today lv0">сегодня <b>0/);
  assert.match(studyInfo({ total: 50, learned: 20, left: 40, late: 3 }), /today lv3">сегодня <b>40<\/b><\/span><span class="late"[^>]*>\?<\/span><\/span>$/);
});

test('учёба: режимы — список ⇄ сетка, как проекты и колоды', async () => {
  await press('goStudy');
  assert.equal(state.pager.items.length, 5);                     // режимы выводятся страницами
  assert.equal(count(/class="item"/), 5);
  assert.match(app.innerHTML, /<header>.*data-act="toggleLayout"/);
  await press('toggleLayout');
  assert.match(page(), /class="page grid /);
  assert.equal(count(/class="gtile"/), 5);
  assert.equal(count(/data-act="openSheet"/), 5);
  await press('openSheet', { id: 'game' });
  assert.equal(state.sheet, 'game');
  await press('closeSheet');
  await press('toggleLayout');
  assert.equal(count(/class="item"/), 5);
});

test('порядок карточек в учёбе случайный (не по алфавиту / не по порядку колоды)', async () => {
  const buildOrder = await imp('study/buildOrder.js');
  const cards = Array.from({ length: 30 }, (_, i) => ({ id: i, deck_id: 1, ord: i, due: 0, ll: 0, interval: 0, reps: 0 }));
  Math.random = realRandom;
  try {
    const seen = new Set();
    for (let k = 0; k < 6; k++) for (const m of ['cards', 'srs', 'listen']) {
      const { order } = buildOrder(m, cards, { perDay: 99, max: 99, used: {} });
      assert.deepEqual([...order].sort((a, b) => a - b), cards.map(c => c.id));   // те же карточки, без потерь
      seen.add(order.join());
    }
    assert.ok(seen.size > 3, 'порядок меняется от запуска к запуску');
  } finally { Math.random = () => 0.999999; }
});

test('интервальное повторение: оценка по поведению, без кнопок оценки, листание по кругу', async () => {
  await press('startStudy', { mode: 'srs', scope: 'all' });
  assert.equal(state.nav.v, 'session');
  assert.equal(state.session.scope, 'all');                      // всегда по всем колодам
  assert.match(page(), /Осталось 8 из 8/);
  assert.match(page(), /English · Basics/);
  assert.match(app.innerHTML, /class="tabs"/);                   // нижняя панель не пропадает
  assert.doesNotMatch(app.innerHTML, /<header>(?:(?!<\/header>)[\s\S])*data-act="goSettings"/);
  assert.match(app.innerHTML, /class="flip" data-act="flip"/);
  assert.match(app.innerHTML, /<button class="speak lg" data-act="speak" aria-label="Озвучить"[^>]*><svg/);
  assert.match(app.innerHTML, /Перевернуть/);
  assert.doesNotMatch(app.innerHTML, /data-act="grade"|Снова|Трудно|Хорошо|Легко/);
  await press('flip');
  assert.ok(flipEl.cls.has('flipped'));
  assert.doesNotMatch(app.innerHTML, /data-act="grade"/);        // после ответа тоже никаких оценок
  await press('flip'); await press('flip'); await press('flip');
  await press('skip'); await press('skip');                      // пролистали не глядя — расписание не тронуто
  assert.deepEqual([state.session.order.length, state.session.pos], [8, 2]);
  const easy = currentCard(state.session);
  wait(2000); await press('flip'); wait(2000); await press('skip');   // вспомнил за 2 с, ответ глянул 2 с → легко
  assert.match(page(), /Осталось 7 из 8/);
  assert.equal(state.revealed, false);
  assert.deepEqual([easy.interval, easy.reps], [4, 1]);
  assert.ok(easy.due > Date.now() + 3 * DAY);
  const hard = currentCard(state.session);
  wait(10000); await press('flip'); wait(6000); await press('skip');   // мучился и долго читал → «Снова»
  assert.match(page(), /Осталось 7 из 8/);
  assert.deepEqual([hard.interval, hard.reps], [0, 0]);
  assert.ok(hard.due > Date.now() && hard.due <= Date.now() + 11 * 60000);
  assert.equal(state.session.order.at(-1), hard.id);
  const posBefore = state.session.pos;
  wait(60000); await press('skip');                              // отвлёкся на минуту — не оцениваем
  assert.deepEqual([state.session.order.length, state.session.pos], [7, posBefore + 1]);
  await press('prev');                                           // назад: без оценки, карточка «пересмотрена»
  assert.equal(track.revisit, true);
  assert.match(page(), /card-back/);
  document.hidden = true; onVisibility(); wait(60000);           // свернули приложение — время не идёт
  document.hidden = false; onVisibility(); wait(2000);
  await press('flip');
  assert.ok(track.think >= 2000 && track.think < 2500, `think=${track.think}`);
  await press('skip');                                           // перевернул и ушёл — это тоже оценка (легко)
  assert.equal(state.session.order.length, 6);
  const p0 = state.session.pos;
  for (let i = 0; i < 6; i++) await press('skip');               // вперёд по кругу, не глядя
  assert.equal(state.session.pos, p0);
});

test('«На слух»: плеер вместо текста, «Показать текст» — подсказка, перевод, оценка и запись в историю', async () => {
  await press('goStudy');
  bridge.io.spoken = null;
  await press('startStudy', { mode: 'listen', scope: 'd:1' });
  assert.equal(state.session.mode, 'listen');
  assert.deepEqual(bridge.io.spoken, { text: 'apple', lang: 'en-US' });   // слово звучит само при показе
  assert.match(app.innerHTML, /button class="speak xl" data-act="play"/);
  assert.match(app.innerHTML, /class="big hidtext" hidden>apple/);          // текст спрятан
  assert.match(app.innerHTML, /Показать текст/);
  assert.doesNotMatch(app.innerHTML, /data-act="toggleDir"/);
  bridge.io.spoken = null;
  await press('play', { t: 'apple', lang: 'en-US' });
  assert.deepEqual(bridge.io.spoken, { text: 'apple', lang: 'en-US' });
  assert.equal(track.plays, 1);
  await press('showText');
  assert.equal(track.hinted, true);
  const card = currentCard(state.session), due = card.due;
  flipEl.cls.delete('flipped');
  wait(2000); await press('flip'); wait(2000); await press('skip');   // подсмотрел, перевёл → «хорошо»
  const last = (await listReviewsSince(0)).at(-1);
  assert.deepEqual([last.mode, last.grade, Number(last.hinted), Number(last.plays), last.fresh], ['listen', 'good', 1, 1, 0]);
  assert.equal(card.due, due);                                    // расписание не двигается
  await press('back');
});

test('«Говорить»: микрофон → оценка сходства, попытка пишется в базу, оценка карточки по произношению', async () => {
  await press('goStudy');
  await press('startStudy', { mode: 'speak', scope: 'd:1' });
  assert.equal(state.session.mode, 'speak');
  assert.match(app.innerHTML, /data-act="record"/);
  assert.match(app.innerHTML, /Скажите вслух/);
  assert.match(app.innerHTML, /class="big hidtext" hidden>apple/);
  assert.doesNotMatch(app.innerHTML, /data-act="toggleDir"/);
  bridge.io.heard = new Error('Не расслышал: нажмите микрофон и скажите ещё раз');
  await press('record', { lang: 'en-US' });
  assert.match(toastEl.textContent, /Не расслышал/);
  assert.deepEqual([state.speech, state.listening], [null, false]);
  bridge.io.heard = { text: 'aple', confidence: 0.6, alternatives: ['apple'], audio: null };
  await press('record', { lang: 'en-US' });
  assert.deepEqual(bridge.io.listened, { action: 'listen', lang: 'en-US' });
  assert.deepEqual([state.speech.attempts, state.speech.score], [1, 0.94]);
  assert.match(fields.speechres.innerHTML, /94%/);
  await press('skip');
  const last = (await listReviewsSince(0)).at(-1);
  assert.deepEqual([last.mode, last.grade], ['speak', 'easy']);
  assert.equal(state.speech, null);                                // у следующей карточки попыток ещё нет
  assert.equal((await listPronunciationsSince(0)).length, 1);
  const n = (await listReviewsSince(0)).length;
  await press('skip');                                           // без попытки оценки нет: в историю ничего не добавилось
  assert.equal((await listReviewsSince(0)).length, n);
  bridge.io.heard = null;
  await press('back');
});

test('автоозвучка и озвучка по голосу проекта', async () => {
  await press('setPref', { key: 'autoplay', v: 'on' });
  await press('back');
  await press('startStudy', { mode: 'srs', scope: 'd:1' });
  assert.deepEqual(bridge.io.spoken, { text: 'apple', lang: 'en-US' });
  await press('speak', { t: 'hello', lang: 'de-DE' });
  assert.deepEqual(bridge.io.spoken, { text: 'hello', lang: 'de-DE' });
  const icon = { classList: { add: c => icon.on = c, remove: () => {} } };
  await press('speak', { t: 'bye', lang: 'en-US' }, icon);        // волны на значке оживают на время озвучки
  assert.equal(icon.on, 'on');
  await press('setPref', { key: 'autoplay', v: 'off' });
  await press('back');
});

test('системная «Назад»: ровно один шаг каждый раз до библиотеки, дальше остаёмся', async () => {
  state.nav = { v: 'library' }; state.stack = [];
  await press('goStudy');
  await press('goSettings');
  await press('goLibrary');
  await press('goProject', { id: 1 });
  await press('goDeck', { id: 1 });
  const depth = state.stack.length;
  await press('goDeck', { id: 1 });                              // тот же экран — стек не растёт
  assert.equal(state.stack.length, depth);
  for (const v of ['project', 'library', 'settings', 'study', 'library']) {
    await systemBack();
    assert.equal(state.nav.v, v);
  }
  assert.equal(state.stack.length, 0);
  const shown = page();
  for (let i = 0; i < 4; i++) {                                  // дальше первого экрана — никуда
    await systemBack();
    assert.equal(state.nav.v, 'library');
    assert.equal(page(), shown);
  }
});

test('«Назад» пропускает экраны, которых уже нет (удалённый проект)', async () => {
  await press('goLibrary');
  await press('newProject');
  setFields({ name: 'Temp', tts: 'en-US' });
  await press('saveProject');
  const t = (await listProjects()).find(c => c.name === 'Temp');
  await press('goProject', { id: t.id });
  await press('editProject', { id: t.id });
  await press('delProject', { id: t.id });
  await systemBack();                                            // формы и проекта уже нет — пропущены
  assert.equal(state.nav.v, 'library');
  assert.doesNotMatch(page(), /Temp/);
});

test('системная «Назад» с экрана без стека ведёт в библиотеку', async () => {
  state.nav = { v: 'study' }; state.stack = [];
  await systemBack();
  assert.equal(state.nav.v, 'library');
});

test('isSwipe: длинный жест, быстрый флик, медленный короткий и случайный сдвиг', () => {
  assert.equal(isSwipe(70, 900), true);       // длинный
  assert.equal(isSwipe(40, 10), true);        // короткий, но быстрый — флик
  assert.equal(isSwipe(40, 400), false);      // короткий и медленный
  assert.equal(isSwipe(20, 1), false);        // меньше минимума
  assert.equal(isSwipe(-45, 30), true);       // влево
});

test('страницы вместо прокрутки: число элементов зависит от высоты области, точки страниц', async () => {
  for (let i = 1; i <= 10; i++) await insertProject(`Proj${String(i).padStart(2, '0')}`, 'en-US');
  setHeight(222);                                                // (222+10)/(64+10) = 3 в странице
  await press('goLibrary');
  assert.deepEqual(state.pager.starts, [0, 3, 6, 9]);
  assert.equal(count(/class="item"/), 3);
  assert.equal(count(/class="dot( on)?"/), 4);                          // 11 проектов → 4 страницы
  setHeight(500);
  await press('goStudy'); await press('goLibrary');
  assert.deepEqual(state.pager.starts, [0, 6]);
  assert.equal(count(/class="dot( on)?"/), 2);
  setHeight(222);
  await press('goStudy'); await press('goLibrary');
  await press('gotoPage', { i: 2 });
  assert.equal(state.page, 2);
  assert.match(page(), /class="dot on" data-act="gotoPage" data-i="2"/);
  await press('toggleLayout');                                   // сетка: 2 колонки
  setHeight(300);
  await press('goStudy'); await press('goLibrary');
  assert.deepEqual(state.pager.starts, [0, 4, 8]);               // 2 ряда × 2 колонки
  assert.equal(count(/class="gtile"/), 4);
  await press('toggleLayout');
});

test('свайпы по кругу: страницы → следующий экран → … → библиотека', async () => {
  setHeight(222);
  await press('goLibrary');
  assert.equal(count(/class="dot( on)?"/), 4);
  swipeNavigate(1); swipeNavigate(1); swipeNavigate(1);
  assert.equal(state.page, 3);
  await swipeNavigate(1);                                        // за последней страницей — «Учёба»
  assert.equal(state.nav.v, 'study');
  await swipeNavigate(-1);                                       // назад — на последнюю страницу библиотеки
  assert.deepEqual([state.nav.v, state.page], ['library', 3]);
  swipeNavigate(-1);
  assert.equal(state.page, 2);
  await press('goLibrary');
  await swipeNavigate(-1);                                       // перед первой страницей — «Настройки»
  assert.equal(state.nav.v, 'settings');
  assert.equal(state.page, 4);                                   // последняя из пяти страниц настроек
  assert.match(page(), /LingvaDesk/);
  assert.match(page(), new RegExp(`Версия ${APP_VERSION.replace(/\./g, '\\.')}`));
  assert.match(page(), /DataLaw/);
  await swipeNavigate(1);                                        // после последней — снова библиотека
  assert.deepEqual([state.nav.v, state.page], ['library', 0]);
});

test('внутри проекта страницы листаются по кругу и не выходят на другие экраны', async () => {
  const pid = (await listProjects())[0].id;
  for (let i = 1; i <= 7; i++) await insertDeck(pid, `Deck${i}`);
  setHeight(222);
  await press('goProject', { id: pid });
  assert.equal(count(/class="dot( on)?"/), 3);                          // 8 колод по 3
  swipeNavigate(-1);                                             // перед первой — последняя
  assert.equal(state.page, 2);
  swipeNavigate(1);                                              // после последней — первая
  assert.equal(state.page, 0);
  assert.equal(state.nav.v, 'project');
});

test('настройки: пять страниц, тема/шрифт/анимации/вибрация применяются и сохраняются', async () => {
  setHeight(400);
  await press('goSettings');
  assert.equal(state.pager.fixed, true);
  assert.match(page(), /class="dtab on" data-act="gotoPage" data-i="0">Вид</);
  const all = state.pager.items.join('');
  for (const t of ['Тема', 'AMOLED', 'Вибрация', 'Что показывать первым', 'Проверка', 'Автоозвучка', 'Новых карточек в день', 'Карточек за сессию', 'Импорт', 'Экспорт', 'Сбросить прогресс', 'Резервная копия']) assert.match(all, new RegExp(t));
  assert.doesNotMatch(all, /Вид библиотеки|Порядок карточек/);   // есть на основных экранах
  assert.equal(count(/class="dtab/, page()), 5);
  assert.match(app.innerHTML, /class="tab on" data-act="goSettings"/);   // вкладка «Настройки» подсвечена, шапка без «назад»
  assert.doesNotMatch(app.innerHTML, /<header>(?:(?!<\/header>)[\s\S])*data-act="goSettings"/);
  for (const [key, v] of [['theme', 'dark'], ['font', 'l'], ['anim', 'off'], ['layout', 'grid'], ['check', 'choice']]) await press('setPref', { key, v });
  assert.deepEqual([document.documentElement.dataset.theme, document.documentElement.dataset.font, document.documentElement.dataset.anim], ['dark', 'l', 'off']);
  Object.assign(state.prefs, { theme: 'auto', font: 'm', anim: 'on', layout: 'list', check: 'flip' });
  await loadPrefs();
  assert.deepEqual([state.prefs.theme, state.prefs.font, state.prefs.anim, state.prefs.layout, state.prefs.check], ['dark', 'l', 'off', 'grid', 'choice']);
  for (const [key, v] of [['anim', 'on'], ['layout', 'list'], ['check', 'flip']]) await press('setPref', { key, v });
});

test('backup, восстановление, сброс прогресса, отмена SAF', async () => {
  await press('backup');
  assert.match(bridge.io.saved.name, /^lingvadesk-\d{8}-\d{4}\.fcbak$/);
  bridge.io.picked = { name: 'x.fcbak', data: 'AAAA' };
  await press('restore');
  assert.match(toastEl.textContent, /pre-restore-1\.db/);
  assert.equal(state.nav.v, 'library');
  await press('resetProgress');
  assert.match(toastEl.textContent, /Прогресс сброшен/);
  toastEl.textContent = '';
  bridge.io.picked = null;
  await press('importLibrary');
  assert.equal(toastEl.textContent, '');
});

test('экспорт всей библиотеки на верхнем уровне', async () => {
  await press('goLibrary');
  await press('exportLibrary');
  assert.match(bridge.io.saved.name, /^lingvadesk-library-/);
  assert.match(toastEl.textContent, /экспортирована/);
});

test('CRUD проект: создать, дубликат, изменить, удалить', async () => {
  await press('goLibrary');
  await press('newProject');
  assert.match(page(), /Новый проект/);
  assert.match(page(), /<datalist id="tts-codes">/);
  assert.doesNotMatch(app.innerHTML, /<header>(?:(?!<\/header>)[\s\S])*data-act="goSettings"/);
  setFields({ name: 'Даты', tts: 'ru-RU' });
  await press('saveProject');
  assert.equal(state.nav.v, 'library');
  await press('newProject');
  setFields({ name: 'Даты', tts: 'ru-RU' });
  await press('saveProject');
  assert.match(toastEl.textContent, /уже есть/);
  setFields({ name: '  ', tts: '' });
  await press('saveProject');
  assert.match(toastEl.textContent, /Введите название/);
  const p = (await listProjects()).find(c => c.name === 'Даты');
  await press('goProject', { id: p.id });
  assert.match(page(), /Колод нет/);
  await press('editProject', { id: p.id });
  assert.match(page(), /value="Даты"/);
  setFields({ name: 'Хронология', tts: 'ru-RU' });
  await press('saveProject');
  assert.equal(state.nav.v, 'project');
  assert.match(page(), /Хронология/);
  await press('editProject', { id: p.id });
  await press('delProject', { id: p.id });
  assert.equal(state.nav.v, 'library');
  assert.doesNotMatch(page(), /Хронология/);
});

test('CRUD колода: создать, изменить, перенести в другой проект, удалить', async () => {
  const [en, other] = [(await listProjects()).find(c => c.name === 'English'), (await listProjects()).find(c => c.name === 'Proj01')];
  await press('goProject', { id: other.id });
  await press('newDeck');
  assert.match(page(), /Новая колода/);
  setFields({ name: 'Договоры', project: other.id });
  await press('saveDeck');
  assert.match(page(), /Договоры/);
  const deck = (await listAllDecks()).find(d => d.name === 'Договоры');
  await press('goDeck', { id: deck.id });
  await press('editDeck', { id: deck.id });
  assert.match(page(), /value="Договоры"/);
  setFields({ name: 'Контракты', project: en.id });
  await press('saveDeck');
  assert.match(page(), /Контракты/);
  assert.match(page(), /English · 0 карточек/);
  await press('editDeck', { id: deck.id });
  await press('delDeck', { id: deck.id });
  assert.equal(state.nav.v, 'project');
  assert.equal((await listAllDecks()).some(d => d.name === 'Контракты'), false);
});

test('CRUD карточка: создать, «ещё», проверка, изменить, перенести, удалить', async () => {
  await press('goProject', { id: 1 });
  await press('newDeck');
  setFields({ name: 'Допы', project: 1 });
  await press('saveDeck');
  const extra = (await listAllDecks()).find(d => d.name === 'Допы');
  await press('goDeck', { id: 1 });
  await press('newCard');
  assert.match(page(), /＋ ещё/);
  assert.equal(count(/class="row foot"/), 1);                  // кнопки формы — одним рядом
  setFields({ f: ' ', b: 'x', e: '', et: '', deck: 1 });
  await press('saveCard');
  assert.match(toastEl.textContent, /Заполните слово и перевод/);
  setFields({ f: 'cat', b: 'кот', e: 'The cat sleeps.', et: 'Кот спит.', deck: 1 });
  await press('saveCard', { more: '1' });
  assert.match(page(), /Новая карточка/);
  assert.doesNotMatch(page(), /value="cat"/);
  setFields({ f: 'dog', b: 'пёс', e: '', et: '', deck: 1 });
  await press('saveCard');
  assert.equal(state.nav.v, 'deck');
  const cat = (await listCards(1)).find(c => c.front === 'cat');
  assert.equal(cat.example_tr, 'Кот спит.');
  await press('editCard', { id: cat.id });
  assert.match(page(), /value="cat"/);
  assert.match(page(), />The cat sleeps\.<\/textarea>/);
  setFields({ f: 'kitten', b: 'котёнок', e: '', et: '', deck: extra.id });
  await press('saveCard');
  assert.equal((await listCards(extra.id))[0].front, 'kitten');
  await press('goDeck', { id: extra.id });
  await press('editCard', { id: cat.id });
  await press('delCard');
  assert.equal((await listCards(extra.id)).length, 0);
  const dog = (await listCards(1)).find(c => c.front === 'dog');
  await press('goDeck', { id: 1 });
  await press('editCard', { id: dog.id });
  await press('delCard');
  assert.equal((await listCards(1)).length, 8);
  await press('goProject', { id: 1 });
  await press('editDeck', { id: extra.id });
  await press('delDeck', { id: extra.id });
});

const target = { closest: sel => (sel === '.flip' ? el : sel.includes('button') ? null : null) };
const el = { style: {}, setPointerCapture() {} };
const areaTarget = { closest: sel => (sel === '.view' ? {} : null) };
const drag = async (t, x0, x1, y = 0, id = 1) => {
  await onPointerDown({ pointerId: id, clientX: x0, clientY: 300, button: 0, target: t });
  await onPointerMove({ pointerId: id, clientX: (x0 + x1) / 2, clientY: 300 + y / 2 });
  await onPointerMove({ pointerId: id, clientX: x1, clientY: 300 + y });
  await onPointerUp({ pointerId: id });
};

test('жесты карточки: по кругу в обе стороны, пружина, вертикаль — прокрутка', async () => {
  await press('goStudy');
  await press('startStudy', { mode: 'cards', scope: 'd:1' });
  assert.equal(state.session.pos, 0);
  await drag(target, 60, 250);                                   // вправо на первой — последняя (по кругу)
  assert.equal(state.session.pos, 7);
  assert.match(el.style.transform, /130%/);
  assert.match(page(), /card-back/);
  assert.equal(consumeSuppress(), true);
  assert.equal(consumeSuppress(), false);
  await drag(target, 250, 60);                                   // влево на последней — первая (по кругу)
  assert.equal(state.session.pos, 0);
  assert.match(el.style.transform, /-130%/);
  assert.match(page(), /card-in/);
  consumeSuppress();
  await drag(target, 250, 230);                                  // короткий — возврат
  assert.equal(state.session.pos, 0);
  assert.equal(el.style.transform, '');
  consumeSuppress();
  await drag(target, 100, 130, 400);                             // вертикальный
  assert.equal(state.session.pos, 0);
  assert.equal(consumeSuppress(), false);
});

test('жесты: быстрый короткий флик листает карточку, диагональный жест не отменяется', async () => {
  await press('goStudy');
  await press('startStudy', { mode: 'cards', scope: 'd:1' });
  await drag(target, 250, 205);                                  // 45 px, мгновенно — флик
  assert.equal(state.session.pos, 1);
  consumeSuppress();
  await drag(target, 250, 100, 60);                              // диагональ: dy заметный, но не доминирует
  assert.equal(state.session.pos, 2);
  consumeSuppress();
});

test('жесты: клик после свайпа гасится, тап по кнопке не начинает жест', async () => {
  flipEl.cls.delete('flipped');
  await drag(target, 250, 100);
  await press('flip');                                           // «клик» сразу после свайпа
  assert.equal(flipEl.cls.has('flipped'), false);
  await press('flip');                                           // настоящий тап
  assert.equal(flipEl.cls.has('flipped'), true);
  await onPointerDown({ pointerId: 3, clientX: 10, clientY: 10, button: 0, target: { closest: sel => (sel.includes('button') ? {} : el) } });
  await onPointerMove({ pointerId: 3, clientX: 300, clientY: 10 });
  await onPointerUp({ pointerId: 3 });
  assert.equal(consumeSuppress(), false);
});

test('свайп, начатый на кнопке свободной области, листает экран и не нажимает кнопку', async () => {
  setHeight(2000);
  await press('goStudy');
  const onButton = { closest: sel => (sel === '.view' ? {} : null) };      // кнопка-плитка не блокирует жест
  await drag(onButton, 300, 40);
  assert.equal(state.nav.v, 'stats');
  await press('startStudy', { mode: 'srs', scope: 'all' });                                // «клик» после жеста погашен
  assert.equal(state.nav.v, 'stats');
  await press('goStudy');
});

test('жесты по свободной области: листают страницы и экраны; в сессии и формах отключены', async () => {
  setHeight(2000);
  await press('goStudy');
  await drag(areaTarget, 250, 60);                               // «Учёба» — одна страница: влево → «Статистика»
  assert.equal(state.nav.v, 'stats');
  await drag(areaTarget, 60, 250);                               // вправо → обратно в «Учёбу»
  assert.equal(state.nav.v, 'study');
  await drag(areaTarget, 60, 250);                               // вправо → библиотека
  assert.equal(state.nav.v, 'library');
  await drag(areaTarget, 250, 230);                              // короткий — ничего
  assert.equal(state.nav.v, 'library');
  consumeSuppress();                                             // (браузер шлёт клик после жеста — он гасится)
  await press('newProject');
  await drag(areaTarget, 250, 60);                               // на форме свайп не работает
  assert.equal(state.nav.v, 'projectForm');
  await press('back');
});

test('удаление проекта каскадно очищает данные', async () => {
  await press('goProject', { id: 1 });
  await press('editProject', { id: 1 });
  await press('delProject', { id: 1 });
  assert.equal(state.nav.v, 'library');
  assert.doesNotMatch(page(), />English</);
  assert.match(toastEl.textContent, /Проект удалён/);
});

test('проверка выбором и вводом: ответ переворачивает карточку, неверный — «снова», подсказка, отмена оценки, правка по долгому нажатию', async () => {
  bridge.reset();
  bridge.io.picked = deckFile();
  await press('importLibrary');                                  // прежние тесты удалили библиотеку
  const deckId = (await listAllDecks())[0].id;
  await press('goStudy');
  await press('setPref', { key: 'check', v: 'choice' });
  await press('startStudy', { mode: 'srs', scope: 'all' });
  assert.equal(state.quiz.kind, 'choice');
  assert.equal(count(/data-act="pick"/), 4);
  assert.doesNotMatch(app.innerHTML, /class="flip" data-act="flip"/);   // тап по карточке не раскрывает ответ
  const card = currentCard(state.session), q = state.quiz;
  const wrong = q.options.findIndex(t => t !== q.answer);
  flipEl.cls.delete('flipped');
  wait(1000);
  await press('pick', { i: wrong });
  assert.equal(q.result, 'bad');
  assert.ok(flipEl.cls.has('flipped'));
  assert.match(fields.controls.innerHTML, /Дальше/);
  await press('pick', { i: q.options.indexOf(q.answer) });         // повторный ответ игнорируется
  assert.equal(q.result, 'bad');
  await press('skip');                                           // неверно → «снова»: карточка вернётся
  assert.equal(state.session.order.length, 8);
  assert.equal(state.session.order.includes(card.id), true);
  assert.match(page(), /data-act="undo"/);
  await press('undo');
  assert.equal(currentCard(state.session).id, card.id);
  assert.equal(card.due, 0);                                     // расписание вернулось
  assert.doesNotMatch(page(), /data-act="undo"/);
  await press('setPref', { key: 'check', v: 'type' });
  await press('back');
  await press('startStudy', { mode: 'srs', scope: 'all' });
  const t1 = currentCard(state.session);
  assert.equal(state.quiz.kind, 'type');
  setFields({ ans: '' });
  await press('check');
  assert.match(toastEl.textContent, /Введите ответ/);
  await press('hint');
  assert.equal(state.quiz.hint, 1);
  setFields({ ans: t1.back.toUpperCase() });
  await press('check');
  assert.equal(state.quiz.result, 'ok');
  wait(3000);
  await press('skip');
  assert.equal(state.session.order.includes(t1.id), false);      // верно, но с подсказкой → «трудно», карточка ушла из очереди
  assert.equal(t1.interval, 1);
  await press('setPref', { key: 'check', v: 'flip' });
  await press('back');
});

test('долгое нажатие на карточку открывает её правку; после сохранения сессия показывает новый текст', async () => {
  const deckId = (await listAllDecks())[0].id;
  await press('goStudy');
  await press('startStudy', { mode: 'cards', scope: `d:${deckId}` });
  const card = currentCard(state.session);
  const target = { closest: sel => (/input|button/.test(sel) ? null : flipEl), style: {}, setPointerCapture() {} };
  onPointerDown({ target, pointerId: 9, clientX: 100, clientY: 100, button: 0 });
  await new Promise(r => setTimeout(r, 750));
  assert.equal(state.nav.v, 'cardForm');
  assert.equal(state.nav.id, card.id);
  onPointerUp({ pointerId: 9, clientX: 100, clientY: 100 });
  await press('flip');                                           // клик, который браузер шлёт после отпускания, гасится
  assert.equal(state.nav.v, 'cardForm');
  setFields({ f: 'apple!', b: 'яблоко', e: '', et: '', deck: String(card.deck_id) });
  await press('saveCard');
  assert.equal(state.nav.v, 'session');
  assert.equal(currentCard(state.session).front, 'apple!');
  await press('back');
});

test('статистика: параметры списком / сеткой, по нажатию — подробное окно, всё из истории в базе', async () => {
  setHeight(900);
  await press('goStudy');
  await press('goStats');
  assert.equal(state.nav.v, 'stats');
  assert.equal(state.pager.items.length, 12);
  assert.equal(count(/data-act="openStat"/), 12);
  assert.match(app.innerHTML, /<header>.*data-act="toggleLayout"/);
  assert.doesNotMatch(page(), /class="sheet"/);
  const all = state.pager.items.join('');
  for (const t of ['Сегодня', 'Серия', 'Удержание', 'Выучено', 'Оценки', 'На слух и подсказки', 'Время', 'Колоды', 'Трудные', 'Прогноз', 'Речь', 'Слабые слова']) assert.match(all, new RegExp(t));
  const detail = {};
  for (let i = 0; i < 12; i++) {
    await press('openStat', { id: i });
    assert.equal(state.sheet, `stat:${i}`);
    assert.match(page(), /class="sheet"/);
    detail[i] = page();
    await press('closeSheet');
    assert.equal(state.sheet, null);
  }
  for (const [i, ts] of [[0, ['сегодня', '7 дней', '30 дней', 'всего', 'Повторений по дням']], [1, ['дней подряд', 'лучшая серия']], [2, ['удержание']], [3, ['выучено', 'новых']],
    [4, ['Оценки за 30 дней', 'Снова']], [5, ['на слух', 'с подсказкой']], [6, ['вспоминание']], [7, ['Basics']], [8, ['Чаще всего']], [9, ['Придёт на повторение']], [10, ['попыток', 'средняя оценка', 'Попыток по дням']], [11, ['Хуже всего']]])
    for (const t of ts) assert.match(detail[i], new RegExp(t), `окно ${i}: ${t}`);
  await press('openStat', { id: 0 });
  await systemBack();                                            // «Назад» закрывает окно, а не уходит с экрана
  assert.equal(state.sheet, null);
  assert.equal(state.nav.v, 'stats');
  await press('toggleLayout');
  assert.equal(count(/class="gtile"/), 12);
  await press('toggleLayout');
  assert.match(app.innerHTML, /class="tab on" data-act="goStats"/);
  await press('goStudy');
  assert.equal(state.nav.v, 'study');
});

test('текст целиком: названия и подписи переносятся, не обрезаются (нет многоточия и nowrap в списках)', async () => {
  const css = (await import('node:fs')).readFileSync('www/css/style.css', 'utf8');
  for (const sel of ['.item .t', '.item .t small', '.item .tn', '.gtile .gt', '.gtile small', '.sitem b', '.sitem small', 'header h1', '.counter .ctx', '.sub']) {
    const rule = css.split('\n').find(l => l.startsWith(`${sel}{`));
    assert.ok(rule, `нет правила ${sel}`);
    assert.doesNotMatch(rule, /text-overflow|nowrap|overflow:hidden/, sel);
    assert.match(rule, /overflow-wrap:(anywhere|break-word)/, sel);
  }
  assert.match(css, /\.item\{[^}]*min-height:64px/);                 // строка растёт вместе с текстом
  assert.match(css, /\.gtile\{[^}]*min-height:124px/);
});
