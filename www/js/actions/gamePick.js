import answerGame from '../game/answerGame.js';
/** Вариант ответа в игре (data-i). */
export default function gamePick(d) { return answerGame(Number(d.i)); }
