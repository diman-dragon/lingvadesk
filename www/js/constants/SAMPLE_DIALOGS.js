/**
 * Примеры диалогов (библиотека lingvadesk-library): «В кафе» — три роли (роль 3 — вы), «Знакомство» — две роли, «Im Café» — немецкий.
 * Добавляются кнопкой «Добавить пример» на экране «Диалоги»; те же данные лежат в examples/dialogs.json (сверяет test/dialog.test.js).
 */
const scene = (name, rows) => ({ name, kind: 'dialog', cards: rows.map(([speaker, front, back]) => ({ speaker, front, back })) });
export const SAMPLE_DIALOGS = {
  format: 'lingvadesk-library', version: 1,
  projects: [
    { name: 'English', tts: 'en-US', decks: [
      scene('Диалог: В кафе', [
    [1, 'Hi! What can I get for you today?', 'Привет! Что вам предложить сегодня?'],
    [3, 'Hello! Can I have a latte, please?', 'Здравствуйте! Можно мне латте, пожалуйста?'],
    [1, 'Sure. What size would you like?', 'Конечно. Какого размера?'],
    [3, 'A medium one, please.', 'Средний, пожалуйста.'],
    [2, "And I'll have a cappuccino.", 'А мне капучино.'],
    [1, 'Anything to eat with that?', 'Что-нибудь поесть к этому?'],
    [2, 'Just a croissant, thanks.', 'Только круассан, спасибо.'],
    [1, "That's eight fifty in total.", 'С вас восемь пятьдесят.'],
    [3, 'Here you go. Keep the change!', 'Вот, пожалуйста. Сдачи не надо!'],
    [1, 'Thank you! Enjoy your coffee.', 'Спасибо! Приятного кофе.']
      ]),
      scene('Диалог: Знакомство', [
    [1, "Hi, I'm Anna. Nice to meet you!", 'Привет, я Анна. Приятно познакомиться!'],
    [2, "Nice to meet you too. I'm Max.", 'Мне тоже приятно. Я Макс.'],
    [1, 'Where are you from?', 'Откуда вы?'],
    [2, "I'm from Russia. And you?", 'Я из России. А вы?'],
    [1, "I'm from Canada, but I live in Berlin now.", 'Я из Канады, но сейчас живу в Берлине.'],
    [2, 'That sounds exciting! What do you do there?', 'Звучит интересно! Чем вы там занимаетесь?'],
    [1, 'I work as a teacher.', 'Я работаю учителем.']
      ])
    ] },
    { name: 'Deutsch', tts: 'de-DE', decks: [
      scene('Диалог: Im Café', [
    [1, 'Guten Tag! Was darf es sein?', 'Добрый день! Что желаете?'],
    [3, 'Einen Kaffee, bitte.', 'Один кофе, пожалуйста.'],
    [1, 'Mit Milch und Zucker?', 'С молоком и сахаром?'],
    [3, 'Nur mit Milch, danke.', 'Только с молоком, спасибо.'],
    [1, 'Sonst noch etwas?', 'Что-нибудь ещё?'],
    [3, 'Nein, das ist alles.', 'Нет, это всё.'],
    [1, 'Das macht drei Euro fünfzig.', 'С вас три пятьдесят.']
      ])
    ] }
  ]
};
