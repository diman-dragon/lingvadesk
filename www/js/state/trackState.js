/**
 * Что пользователь делает с текущей карточкой. front / back — мс на вопросе / на ответе; think — время на вспоминание
 * (до первого переворота, null — не переворачивал); since — начало отсчёта (0 — пауза); away — отвлёкся.
 */
export const track = { live: false, side: 'front', since: 0, front: 0, back: 0, think: null, flips: 0, revisit: false, away: false };
