import test from 'node:test';
import assert from 'node:assert/strict';
import installBridge from './helpers/installBridge.js';
import deckFile from './helpers/deckFile.js';

// --- заглушки браузера (до импорта модулей приложения) ---
const app = { innerHTML: '', addEventListener() {} };
const toastEl = { textContent: '', classList: { add() {}, remove() {} } };
const flipEl = { cls: new Set(), classList: { toggle: c => (flipEl.cls.has(c) ? (flipEl.cls.delete(c), false) : (flipEl.cls.add(c), true)) } };
const fields = {};
const answers = [];
globalThis.document = {
  documentElement: { dataset: {} },
  querySelector: () => flipEl,
  getElementById: id => id === 'app' ? app : id === 'toast' ? toastEl : (fields[id] ??= { value: '', innerHTML: '' })
};
globalThis.prompt = () => answers.shift();
globalThis.confirm = () => true;
const bridge = installBridge();

const { default: boot } = await import('../www/js/boot.js');
const { default: dispatch } = await import('../www/js/events/dispatch.js');
const { default: handlePopState } = await import('../www/js/events/handlePopState.js');
const { state } = await import('../www/js/state/appState.js');
const { default: loadPrefs } = await import('../www/js/settings/loadPrefs.js');
const { default: listCards } = await import('../www/js/repo/listCards.js');
const { default: listCourses } = await import('../www/js/repo/listCourses.js');
const { default: insertDeck } = await import('../www/js/repo/insertDeck.js');
const { default: onPointerDown } = await import('../www/js/gestures/onPointerDown.js');
const { default: onPointerMove } = await import('../www/js/gestures/onPointerMove.js');
const { default: onPointerUp } = await import('../www/js/gestures/onPointerUp.js');
const { default: consumeSuppress } = await import('../www/js/gestures/consumeSuppress.js');
const { APP_VERSION } = await import('../www/js/constants/APP_VERSION.js');
const setFields = obj => Object.entries(obj).forEach(([k, v]) => (fields[k] = { value: String(v), innerHTML: '' }));

const press = (act, data = {}, el = {}) =>
  dispatch({ type: 'click', target: { closest: () => ({ dataset: { act, ...data }, ...el }) } });
const change = (act, el) =>
  dispatch({ type: 'change', target: { closest: () => ({ dataset: { act, on: 'change' }, ...el }) } });

test.before(() => bridge.reset());

test('запуск: экран «Сегодня» с пустым состоянием и нижним меню', async () => {
  await boot();
  assert.match(app.innerHTML, /Сегодня/);
  assert.match(app.innerHTML, /Пока нет карточек/);
  for (const t of ['Сегодня', 'Библиотека', 'Настройки']) assert.match(app.innerHTML, new RegExp(`<span>${t}</span>`));
  assert.match(app.innerHTML, /class="tab on"/);
});

test('импорт deck.json открывает колоду: hero, режимы, карточки', async () => {
  bridge.io.picked = deckFile();
  await press('importDeck');
  assert.match(app.innerHTML, /Basics/);
  assert.match(app.innerHTML, /8 карточек/);
  for (const m of ['Обучение', 'Последовательно', 'Перемешать', 'Повторение']) assert.match(app.innerHTML, new RegExp(m));
  assert.match(app.innerHTML, /яблоко/);
});

test('библиотека и язык: счётчики и бейджи', async () => {
  await press('goLibrary');
  assert.match(app.innerHTML, /English/);
  assert.match(app.innerHTML, /колод: 1/);
  assert.match(app.innerHTML, /<span class="badge">8<\/span>/);
  await press('goCourse', { id: 1 });
  assert.match(app.innerHTML, /карточек: 8 · к повторению: 8/);
});

test('«Сегодня»: статистика и колоды к повторению, старт SRS одним тапом', async () => {
  await press('goToday');
  assert.match(app.innerHTML, /<b>8<\/b><span>к повторению/);
  assert.match(app.innerHTML, /Пора повторить/);
  await press('studyDeck', { id: 1 });
  assert.equal(state.session.mode, 'srs');
  assert.match(app.innerHTML, /осталось 8/);
  assert.doesNotMatch(app.innerHTML, /class="tabs"/); // обучение — без нижнего меню
});

test('обучение: переворот туда-обратно сколько угодно раз, 4 оценки с интервалами', async () => {
  await press('leaveStudy', { id: 1 });
  await press('startStudy', { mode: 'seq' });
  assert.match(app.innerHTML, /class="flip" data-act="flip"/);
  assert.match(app.innerHTML, /Нажмите, чтобы перевернуть/);
  assert.match(app.innerHTML, /apple/);
  await press('flip');
  assert.ok(flipEl.cls.has('flipped'));
  const controls = fields.controls.innerHTML;
  for (const g of ['Снова', 'Трудно', 'Хорошо', 'Легко', 'Перевернуть']) assert.match(controls, new RegExp(g));
  assert.match(controls, /<small>10 мин<\/small>/);
  assert.match(controls, /<small>1 д<\/small>/);
  for (let i = 0; i < 4; i++) { // обратно, снова вперёд, … — оценки остаются
    await press('flip');
    assert.equal(flipEl.cls.has('flipped'), i % 2 === 1);
    assert.equal(state.revealed, true);
  }
  assert.equal(flipEl.cls.has('flipped'), true); // после 5 переворотов — оборот
  await press('flip');
  assert.equal(flipEl.cls.has('flipped'), false); // и снова лицо
  await press('grade', { g: 'good' });
  assert.match(app.innerHTML, /water/);
  assert.match(app.innerHTML, /осталось 7/);
  assert.match(app.innerHTML, /card-in/);
  assert.equal(state.revealed, false);
});

test('направление: настройка dir сохраняется и меняет вопрос', async () => {
  await press('toggleDir');
  assert.equal(state.prefs.dir, 'rev');
  assert.match(app.innerHTML, /<div class="big">вода<\/div>/);
  await press('toggleDir');
  assert.equal(state.prefs.dir, 'fwd');
});

test('автоозвучка: при показе карточки произносится слово языка', async () => {
  await press('setPref', { key: 'autoplay', v: 'on' });
  bridge.io.spoken = null;
  await press('skip');
  assert.equal(bridge.io.spoken.lang, 'en-US');
  assert.ok(bridge.io.spoken.text);
  await press('speak', { t: 'hello' });
  assert.equal(bridge.io.spoken.text, 'hello');
  await press('setPref', { key: 'autoplay', v: 'off' });
});

test('режим «Обучение»: знакомство (обе стороны, без оценок) → проверка → следующая пачка', async () => {
  await press('goDeck', { id: 1 });
  assert.match(app.innerHTML, /новых/);
  await press('startStudy', { mode: 'learn' });
  assert.match(app.innerHTML, /Знакомство · 1 \/ 7/);
  assert.match(app.innerHTML, /class="flip flipped"/);
  assert.match(app.innerHTML, /Дальше/);
  assert.doesNotMatch(app.innerHTML, /data-act="grade"/);
  for (let i = 0; i < 7; i++) await press('skip');
  assert.doesNotMatch(app.innerHTML, /Знакомство/);
  assert.match(app.innerHTML, /1 \/ 7 · осталось 7/);
  assert.match(app.innerHTML, /Показать ответ/);
  await press('flip');
  await press('grade', { g: 'again' });
  assert.match(app.innerHTML, /осталось 7/); // (7 новых: одну карточку уже оценили в seq) «Снова» вернула карточку в конец
  for (let i = 0; i < 7; i++) { await press('flip'); await press('grade', { g: 'good' }); }
  assert.match(app.innerHTML, /Пачка выучена/);
  await press('restart');
  assert.match(app.innerHTML, /Новых слов нет|Знакомство/);
});

test('выход из обучения: экран колоды, позиция сохранена', async () => {
  await press('leaveStudy', { id: 1 });
  assert.match(app.innerHTML, /\+ Карточка/);
  assert.match(app.innerHTML, /Карточки \(8\)/);
  assert.match(app.innerHTML, /продолжить с \d/);
});

test('кнопка «Назад» возвращает на предыдущий экран; удалённый объект → библиотека', async () => {
  await handlePopState({ state: { nav: { v: 'library' } } });
  assert.match(app.innerHTML, /Библиотека/);
  await handlePopState({ state: null });
  assert.match(app.innerHTML, /Сегодня/);
  state.session = null;
  await handlePopState({ state: { nav: { v: 'study', id: 1 } } });
  assert.match(app.innerHTML, /Сегодня/); // сессии нет — безопасный возврат
  await handlePopState({ state: { nav: { v: 'course', id: 999 } } });
  assert.match(app.innerHTML, /Библиотека/); // курс удалён — не падаем
});

test('настройки: группы, бренд, версия; тема/шрифт/анимации/вид применяются и сохраняются', async () => {
  await press('goSettings');
  for (const t of ['Внешний вид', 'Обучение', 'Данные', 'О приложении', 'Автоозвучка', 'Сбросить прогресс', 'AMOLED', 'Вид библиотеки', 'LingvaDesk', APP_VERSION.replace(/\./g, '\\.'), 'DataLaw'])
    assert.match(app.innerHTML, new RegExp(t));
  assert.match(app.innerHTML, /<svg class="logo"/);
  for (const [key, v] of [['theme', 'dark'], ['font', 'l'], ['anim', 'off'], ['layout', 'grid']]) await press('setPref', { key, v });
  assert.deepEqual(
    [document.documentElement.dataset.theme, document.documentElement.dataset.font, document.documentElement.dataset.anim],
    ['dark', 'l', 'off']);
  Object.assign(state.prefs, { theme: 'auto', font: 'm', anim: 'on', layout: 'list' }); // «перезапуск»
  await loadPrefs();
  assert.deepEqual([state.prefs.theme, state.prefs.font, state.prefs.anim, state.prefs.layout], ['dark', 'l', 'off', 'grid']);
  for (const [key, v] of [['anim', 'on'], ['layout', 'list']]) await press('setPref', { key, v });
});

test('backup и restore', async () => {
  await press('backup');
  assert.match(bridge.io.saved.name, /^lingvadesk-\d{8}-\d{4}\.fcbak$/);
  bridge.io.picked = { name: 'x.fcbak', data: 'AAAA' };
  await press('restore');
  assert.match(toastEl.textContent, /pre-restore-1\.db/);
  assert.match(app.innerHTML, /Сегодня/);
});

test('сброс прогресса возвращает карточки к повторению', async () => {
  await press('studyDeck', { id: 1 });
  await press('flip');
  await press('grade', { g: 'easy' });
  await press('goSettings');
  await press('resetProgress');
  assert.match(toastEl.textContent, /Прогресс сброшен/);
  await press('goToday');
  assert.match(app.innerHTML, /<b>8<\/b><span>к повторению/);
});

test('отмена диалога SAF не показывает ошибку и не ломает экран', async () => {
  await press('goLibrary');
  toastEl.textContent = '';
  const before = app.innerHTML;
  bridge.io.picked = null;
  await press('importDeck');
  assert.equal(toastEl.textContent, '');
  assert.equal(app.innerHTML, before);
});

test('CRUD курс: создать, дубликат, открыть, изменить, удалить', async () => {
  await press('goLibrary');
  await press('newCourse');
  assert.match(app.innerHTML, /Новый курс/);
  assert.match(app.innerHTML, /<datalist id="tts-codes">/);
  setFields({ name: 'Deutsch', tts: 'de-DE' });
  await press('saveCourse');
  assert.match(app.innerHTML, /Deutsch/);
  await press('newCourse');
  setFields({ name: 'Deutsch', tts: 'de-DE' });
  await press('saveCourse');
  assert.match(toastEl.textContent, /уже есть/);
  setFields({ name: '  ', tts: '' });
  await press('saveCourse');
  assert.match(toastEl.textContent, /Введите название/);
  const de = (await listCourses()).find(c => c.name === 'Deutsch');
  await press('goCourse', { id: de.id });
  assert.match(app.innerHTML, /Колод нет/);
  await press('editCourse');
  assert.match(app.innerHTML, /value="Deutsch"/);
  assert.match(app.innerHTML, /value="de-DE"/);
  assert.match(app.innerHTML, /data-act="delCourse"/);
  setFields({ name: 'Немецкий', tts: 'de-AT' });
  await press('saveCourse');
  assert.match(app.innerHTML, /Немецкий/);
  await press('editCourse');
  await press('delCourse');
  assert.match(app.innerHTML, /Библиотека/);
  assert.doesNotMatch(app.innerHTML, /Немецкий/);
});

test('CRUD колода: создать в курсе, изменить, перенести в другой курс, удалить', async () => {
  await press('goLibrary');
  await press('newCourse');
  setFields({ name: 'Юр. английский', tts: 'en-GB' });
  await press('saveCourse');
  const law = (await listCourses()).find(c => c.name === 'Юр. английский');
  await press('goCourse', { id: law.id });
  await press('newDeck');
  assert.match(app.innerHTML, /Новая колода/);
  setFields({ name: 'Договоры', course: law.id });
  await press('saveDeck');
  assert.match(app.innerHTML, /Договоры/);
  const deckId = Number(/data-act="goDeck" data-id="(\d+)"/.exec(app.innerHTML)[1]);
  await press('goDeck', { id: deckId });
  await press('editDeck');
  assert.match(app.innerHTML, /value="Договоры"/);
  setFields({ name: 'Контракты', course: 1 }); // перенос в курс English
  await press('saveDeck');
  assert.match(app.innerHTML, /Контракты/);
  assert.match(app.innerHTML, /English/);
  await press('goCourse', { id: 1 });
  assert.match(app.innerHTML, /Контракты/);
  await press('goDeck', { id: deckId });
  await press('editDeck');
  await press('delDeck');
  assert.match(app.innerHTML, /English/);
  assert.doesNotMatch(app.innerHTML, /Контракты/);
  await press('goLibrary');
  await press('goCourse', { id: law.id });
  await press('editCourse');
  await press('delCourse');
});

test('CRUD карточка: создать, «ещё», проверка, изменить, перенести, удалить', async () => {
  await press('goCourse', { id: 1 });
  await press('newDeck');
  setFields({ name: 'Допы', course: 1 });
  await press('saveDeck');
  const extra = (await (await import('../www/js/repo/listDecksFlat.js')).default()).find(d => d.name === 'Допы');
  await press('goDeck', { id: 1 });
  await press('newCard');
  assert.match(app.innerHTML, /Новая карточка/);
  assert.match(app.innerHTML, /Сохранить и добавить ещё/);
  setFields({ f: ' ', b: 'x', e: '', et: '', deck: 1 });
  await press('saveCard');
  assert.match(toastEl.textContent, /Заполните слово и перевод/);
  setFields({ f: 'cat', b: 'кот', e: 'The cat sleeps.', et: 'Кот спит.', deck: 1 });
  await press('saveCard', { more: '1' });
  assert.match(app.innerHTML, /Новая карточка/);          // осталась пустая форма
  assert.doesNotMatch(app.innerHTML, /value="cat"/);
  setFields({ f: 'dog', b: 'пёс', e: '', et: '', deck: 1 });
  await press('saveCard');
  assert.match(app.innerHTML, /cat/);
  assert.match(app.innerHTML, /dog/);
  const cat = (await listCards(1)).find(c => c.front === 'cat');
  assert.equal(cat.example_tr, 'Кот спит.');
  await press('editCard', { id: cat.id });
  assert.match(app.innerHTML, /value="cat"/);
  assert.match(app.innerHTML, />The cat sleeps\.<\/textarea>/);
  assert.match(app.innerHTML, /data-act="delCard"/);
  setFields({ f: 'kitten', b: 'котёнок', e: 'The kitten plays.', et: '', deck: 1 });
  await press('saveCard');
  assert.match(app.innerHTML, /kitten/);
  assert.equal((await listCards(1)).find(c => c.id === cat.id).example, 'The kitten plays.');
  await press('editCard', { id: cat.id });
  setFields({ f: 'kitten', b: 'котёнок', e: '', et: '', deck: extra.id }); // перенос
  await press('saveCard');
  assert.doesNotMatch(app.innerHTML, /kitten/);
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

test('библиотека: список ⇄ сетка на всех уровнях цепочки', async () => {
  await press('goLibrary');
  assert.match(app.innerHTML, /class="collection list"/);
  assert.match(app.innerHTML, /class="item"/);
  await press('toggleLayout');
  assert.match(app.innerHTML, /class="collection grid"/);
  assert.match(app.innerHTML, /class="gtile"/);
  await press('goCourse', { id: 1 });
  assert.match(app.innerHTML, /class="collection grid"/);
  assert.match(app.innerHTML, /class="gtile"/);
  await press('goDeck', { id: 1 });
  assert.match(app.innerHTML, /class="gtile mini"/);          // карточки — мини-карточками
  assert.match(app.innerHTML, /data-act="editCard"/);
  await press('toggleLayout');
  assert.match(app.innerHTML, /class="collection list"/);
  assert.match(app.innerHTML, /data-act="editCard"/);
  assert.equal(state.prefs.layout, 'list');
});

test('жесты: свайп влево — вперёд, вправо — назад, короткий — возврат; клик после свайпа гасится', async () => {
  await press('goDeck', { id: 1 });
  await press('startStudy', { mode: 'seq' });
  await press('restart');
  const el = { style: {}, setPointerCapture() {} };
  const tgt = { closest: sel => (sel === '.flip' ? el : null) };
  const swipe = async (x0, x1, y = 0) => {
    await onPointerDown({ pointerId: 1, clientX: x0, clientY: 300, button: 0, target: tgt });
    await onPointerMove({ pointerId: 1, clientX: (x0 + x1) / 2, clientY: 300 + y / 2 });
    await onPointerMove({ pointerId: 1, clientX: x1, clientY: 300 + y });
    await onPointerUp({ pointerId: 1 });
  };
  assert.equal(state.session.pos, 0);
  await swipe(250, 60);                                  // влево → вперёд
  assert.equal(state.session.pos, 1);
  assert.match(el.style.transform, /-130%/);
  assert.match(app.innerHTML, /card-in/);
  assert.equal(consumeSuppress(), true);                 // клик после жеста должен быть погашен
  assert.equal(consumeSuppress(), false);
  await swipe(60, 250);                                  // вправо → назад
  assert.equal(state.session.pos, 0);
  assert.match(el.style.transform, /130%/);
  assert.match(app.innerHTML, /card-back/);
  await swipe(250, 60); await consumeSuppress();
  await swipe(250, 230);                                 // короткий — пружина
  assert.equal(state.session.pos, 1);
  assert.equal(el.style.transform, '');
  await consumeSuppress();
  await swipe(100, 130, 400);                            // вертикальный — это прокрутка
  assert.equal(state.session.pos, 1);
  await restart0();
  await swipe(60, 250);                                  // «назад» на первой карточке — некуда
  assert.equal(state.session.pos, 0);
  assert.equal(el.style.transform, '');
  async function restart0() { await press('restart'); }
});

test('жесты: клик, порождённый свайпом, не переворачивает карточку; обычный тап — переворачивает', async () => {
  await press('restart');
  const el = { style: {}, setPointerCapture() {} };
  const tgt = { closest: sel => (sel === '.flip' ? el : null) };
  flipEl.cls.delete('flipped');
  await onPointerDown({ pointerId: 2, clientX: 250, clientY: 300, button: 0, target: tgt });
  await onPointerMove({ pointerId: 2, clientX: 200, clientY: 300 });
  await onPointerMove({ pointerId: 2, clientX: 120, clientY: 300 });
  await onPointerUp({ pointerId: 2 });                   // ушли дальше порога → следующая карточка
  await press('flip');                                   // «клик» сразу после свайпа
  assert.equal(flipEl.cls.has('flipped'), false);
  await press('flip');                                   // настоящий тап
  assert.equal(flipEl.cls.has('flipped'), true);
  await onPointerDown({ pointerId: 3, clientX: 10, clientY: 10, button: 0, target: { closest: sel => (sel === 'button' ? {} : el) } });
  await onPointerMove({ pointerId: 3, clientX: 300, clientY: 10 });
  await onPointerUp({ pointerId: 3 });                   // жест по кнопке внутри карточки не начинается
  assert.equal(consumeSuppress(), false);
});

test('«Назад» из формы идёт по истории браузера, если она есть', async () => {
  await press('goDeck', { id: 1 });
  await press('newCard');
  let backs = 0;
  globalThis.history = { length: 3, back: () => backs++, pushState() {} };
  await press('back');
  assert.equal(backs, 1);
  delete globalThis.history;
  await press('back');                                   // без истории — на родительский экран
  assert.match(app.innerHTML, /Карточки \(8\)/);
});

test('удаление курса каскадно очищает данные', async () => {
  await press('goCourse', { id: 1 });
  await press('editCourse');
  await press('delCourse');
  assert.match(app.innerHTML, /Библиотека/);
  assert.doesNotMatch(app.innerHTML, /English/);
  assert.match(toastEl.textContent, /Курс удалён/);
});
