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

/** Всё, что видит пользователь: экран + текущая страница списка + точки. */
const page = () => app.innerHTML + (app.innerHTML.includes('id="pager"') ? fields.pager.innerHTML + fields.dots.innerHTML : '');
const press = (act, data = {}, el = {}) => dispatch({ type: 'click', target: { closest: () => ({ dataset: { act, ...data }, ...el }) } });
const change = (act, el) => dispatch({ type: 'change', target: { closest: () => ({ dataset: { act, on: 'change' }, ...el }) } });
const setFields = obj => Object.entries(obj).forEach(([k, v]) => (fields[k] = { value: String(v), innerHTML: '' }));
const count = (re, s = page()) => (s.match(new RegExp(re.source, 'g')) || []).length;
const setHeight = h => { fields.pager = { innerHTML: '', clientHeight: h }; };

test.before(() => bridge.reset());

test('запуск: библиотека, две вкладки внизу, настройки в шапке', async () => {
  await boot();
  assert.equal(state.nav.v, 'library');
  assert.match(page(), /Проектов пока нет/);
  assert.match(page(), /<span>Библиотека<\/span>/);
  assert.match(page(), /<span>Учёба<\/span>/);
  assert.doesNotMatch(page(), /Сегодня|Настройки<\/span>/);
  assert.equal(count(/class="tab on"/), 1);
  assert.match(app.innerHTML, /<header>.*data-act="goSettings"/);
  for (const t of ['\\+ Проект', 'Импорт', 'Экспорт']) assert.match(page(), new RegExp(t));
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
  assert.match(page(), /<span class="badge">8<\/span>/);
  await press('importLibrary');
  assert.match(toastEl.textContent, /новых карточек 0/);       // повторный импорт не дублирует
});

test('цепочка проект → колода → карточки; карточки видны только в библиотеке', async () => {
  const pid = (await listProjects())[0].id;
  await press('goProject', { id: pid });
  assert.match(page(), /Basics/);
  assert.match(page(), /карточек: 8 · к повторению: 8/);
  assert.match(page(), /🎓 Учить/);
  await press('goDeck', { id: 1 });
  assert.match(page(), /apple/);
  assert.match(page(), /English · 8 карточек · 8 к повторению/);
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

test('учёба: область, статистика и три режима', async () => {
  await press('goStudy');
  assert.equal(count(/class="tab on"/), 1);
  assert.match(page(), /Что учим/);
  assert.match(page(), /<optgroup label="English"><option value="p:1">Весь проект<\/option><option value="d:1">Basics<\/option>/);
  for (const t of ['Интервальное повторение', 'Обучение', 'Повторение', 'Порядок повторения', 'к повторению', 'новых', 'выучено']) assert.match(page(), new RegExp(t));
  assert.equal(count(/data-act="startStudy"/), 3);
  await change('setScope', { value: 'd:1' });
  assert.equal(state.scope, 'd:1');
  assert.match(page(), /<option value="d:1" selected>/);
  await setSetting('scope', 'p:999');                           // область удалена
  state.scope = 'p:999';
  await press('goStudy');
  assert.equal(state.scope, 'all');
});

test('интервальное повторение: оценки, прогресс, листание по кругу', async () => {
  await press('startStudy', { mode: 'srs' });
  assert.equal(state.nav.v, 'session');
  assert.match(page(), /Осталось 8 из 8/);
  assert.match(page(), /English · Basics/);
  assert.match(app.innerHTML, /class="tabs"/);                   // нижняя панель не пропадает
  assert.doesNotMatch(app.innerHTML, /<header>.*data-act="goSettings"/);
  assert.match(app.innerHTML, /class="flip" data-act="flip"/);
  await press('flip');
  assert.ok(flipEl.cls.has('flipped'));
  const c = fields.controls.innerHTML;
  for (const g of ['Снова', 'Трудно', 'Хорошо', 'Легко']) assert.match(c, new RegExp(g));
  assert.doesNotMatch(c, /Перевернуть/);
  assert.match(c, /<small>10 мин<\/small>/);
  await press('flip'); await press('flip');
  assert.equal(flipEl.cls.has('flipped'), true);
  await press('grade', { g: 'good' });
  assert.match(page(), /Осталось 7 из 8/);
  assert.equal(state.revealed, false);
  for (let i = 0; i < 7; i++) await press('skip');               // вперёд по кругу
  assert.equal(state.session.pos, 0);
  await press('prev');                                           // назад от первой — последняя
  assert.equal(state.session.pos, 6);
  assert.match(page(), /card-back/);
});

test('«Повторение»: без оценок, карточки по кругу, переворот туда-обратно', async () => {
  await press('back');
  assert.equal(state.nav.v, 'study');
  await press('startStudy', { mode: 'review' });
  assert.match(page(), /1 \/ 8/);
  assert.match(page(), /Перевернуть/);
  fields.controls = { innerHTML: 'без оценок' };
  await press('flip'); await press('flip'); await press('flip');
  assert.equal(fields.controls.innerHTML, 'без оценок');
  assert.equal(count(/data-act="grade"/), 0);
  await press('prev');
  assert.equal(state.session.pos, 7);
  await press('skip');
  assert.equal(state.session.pos, 0);
  await press('toggleDir');
  assert.equal(state.prefs.dir, 'rev');
  assert.match(page(), /<div class="big">яблоко<\/div>/);
  await press('toggleDir');
});

test('«Обучение»: знакомство (обе стороны, без оценок) → проверка', async () => {
  await press('back');
  await press('startStudy', { mode: 'learn' });
  assert.match(page(), /Знакомство · 1 \/ 7/);
  assert.match(page(), /class="flip flipped"/);
  assert.match(page(), /К проверке/);
  assert.equal(count(/data-act="grade"/), 0);
  await press('skip'); await press('prev'); await press('prev');
  assert.equal(state.session.pos, 6);                           // знакомство тоже по кругу
  await press('startQuiz');
  assert.match(page(), /Осталось 7 из 7/);
  assert.match(page(), /Показать ответ/);
  assert.doesNotMatch(page(), /Знакомство/);
  for (let i = 0; i < 7; i++) { await press('flip'); await press('grade', { g: 'good' }); }
  assert.match(page(), /Пачка выучена/);
  await press('restart');
  assert.match(page(), /Новых слов нет/);
});

test('автоозвучка и озвучка по голосу проекта', async () => {
  await press('setPref', { key: 'autoplay', v: 'on' });
  await press('back');
  await press('startStudy', { mode: 'review' });
  assert.deepEqual(bridge.io.spoken, { text: 'apple', lang: 'en-US' });
  await press('speak', { t: 'hello', lang: 'de-DE' });
  assert.deepEqual(bridge.io.spoken, { text: 'hello', lang: 'de-DE' });
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
  await press('editProject');
  await press('delProject');
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
  assert.equal(state.pager.per, 3);
  assert.equal(count(/class="item"/), 3);
  assert.equal(count(/class="dot( on)?"/), 4);                          // 11 проектов → 4 страницы
  setHeight(500);
  await press('goStudy'); await press('goLibrary');
  assert.equal(state.pager.per, 6);
  assert.equal(count(/class="dot( on)?"/), 2);
  setHeight(222);
  await press('goStudy'); await press('goLibrary');
  await press('gotoPage', { i: 2 });
  assert.equal(state.page, 2);
  assert.match(page(), /class="dot on" data-act="gotoPage" data-i="2"/);
  await press('toggleLayout');                                   // сетка: 2 колонки
  setHeight(300);
  await press('goStudy'); await press('goLibrary');
  assert.equal(state.pager.per, 4);                              // 2 ряда × 2 колонки
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
  assert.equal(state.page, 3);                                   // последняя из четырёх страниц настроек
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

test('настройки: четыре страницы, тема/шрифт/анимации/вид применяются и сохраняются', async () => {
  setHeight(400);
  await press('goSettings');
  assert.equal(state.pager.fixed, true);
  assert.match(page(), /class="dtab on" data-act="gotoPage" data-i="0">Вид</);
  const all = state.pager.items.join('');
  for (const t of ['Вид библиотеки', 'AMOLED', 'Автоозвучка', 'Порядок повторения', 'Сбросить прогресс', 'Резервная копия']) assert.match(all, new RegExp(t));
  assert.match(app.innerHTML, /data-act="back"/);
  assert.doesNotMatch(app.innerHTML, /<header>.*data-act="goSettings"/);
  for (const [key, v] of [['theme', 'dark'], ['font', 'l'], ['anim', 'off'], ['layout', 'grid'], ['shuffle', 'on']]) await press('setPref', { key, v });
  assert.deepEqual([document.documentElement.dataset.theme, document.documentElement.dataset.font, document.documentElement.dataset.anim], ['dark', 'l', 'off']);
  Object.assign(state.prefs, { theme: 'auto', font: 'm', anim: 'on', layout: 'list', shuffle: 'off' });
  await loadPrefs();
  assert.deepEqual([state.prefs.theme, state.prefs.font, state.prefs.anim, state.prefs.layout, state.prefs.shuffle], ['dark', 'l', 'off', 'grid', 'on']);
  for (const [key, v] of [['anim', 'on'], ['layout', 'list'], ['shuffle', 'off']]) await press('setPref', { key, v });
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
  assert.doesNotMatch(app.innerHTML, /<header>.*data-act="goSettings"/);
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
  await press('editProject');
  assert.match(page(), /value="Даты"/);
  setFields({ name: 'Хронология', tts: 'ru-RU' });
  await press('saveProject');
  assert.equal(state.nav.v, 'project');
  assert.match(page(), /Хронология/);
  await press('editProject');
  await press('delProject');
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
  await press('editDeck');
  assert.match(page(), /value="Договоры"/);
  setFields({ name: 'Контракты', project: en.id });
  await press('saveDeck');
  assert.match(page(), /Контракты/);
  assert.match(page(), /English · 0 карточек/);
  await press('editDeck');
  await press('delDeck');
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
  await press('goDeck', { id: extra.id });
  await press('editDeck');
  await press('delDeck');
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
  await press('startStudy', { mode: 'review' });
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
  await press('startStudy', { mode: 'review' });
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
  await press('goStudy');
  const onButton = { closest: sel => (sel === '.view' ? {} : null) };      // кнопка-плитка не блокирует жест
  await drag(onButton, 300, 40);
  assert.equal(state.nav.v, 'settings');
  await press('startStudy', { mode: 'srs' });                                // «клик» после жеста погашен
  assert.equal(state.nav.v, 'settings');
  await press('goStudy');
});

test('жесты по свободной области: листают страницы и экраны; в сессии и формах отключены', async () => {
  await press('goStudy');
  await drag(areaTarget, 250, 60);                               // «Учёба» — одна страница: влево → настройки
  assert.equal(state.nav.v, 'settings');
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
  await press('editProject');
  await press('delProject');
  assert.equal(state.nav.v, 'library');
  assert.doesNotMatch(page(), />English</);
  assert.match(toastEl.textContent, /Проект удалён/);
});
