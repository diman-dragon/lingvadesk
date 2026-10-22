import submitQuest from '../game/submitQuest.js';
/** «Не знаю» на этапе квеста: считается ошибкой, верный ответ показывается. */
export default function questGiveUp() { return submitQuest(false); }
