import today from './today.js';
import streak from './streak.js';
import retention from './retention.js';
import learned from './learned.js';
import grades from './grades.js';
import modes from './modes.js';
import timing from './timing.js';
import decks from './decks.js';
import hard from './hard.js';
import forecast from './forecast.js';
import speech from './speech.js';
import weak from './weak.js';
/** Параметры статистики по порядку: каждый — функция (данные statsView) → { icon, title, value, sub, detail }. */
export default [today, streak, retention, learned, grades, modes, timing, decks, hard, forecast, speech, weak];
