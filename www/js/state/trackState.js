/**
 * Что пользователь делает с текущей карточкой. front / back — мс на вопросе / на ответе; think — время на вспоминание
 * (до первого переворота или ответа, null — не отвечал); since — начало отсчёта (0 — пауза); away — отвлёкся;
 * correct / hinted — итог вопроса с выбором или вводом (null — не отвечал); n — номер показа (для отложенных подсказок).
 */
export const track = { n: 0, live: false, side: 'front', since: 0, front: 0, back: 0, think: null, flips: 0, revisit: false, away: false, correct: null, hinted: false };
