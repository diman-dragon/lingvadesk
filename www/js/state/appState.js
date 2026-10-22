import { DEFAULT_PREFS } from '../constants/DEFAULT_PREFS.js';
/**
 * nav — текущий экран; stack — пройденные экраны («Назад» снимает верхний); session — сессия учёбы;
 * speechChecked — языки, для которых уже проверен офлайн-пакет распознавания; iconLevel — уровень значка приложения (0–3, null — ещё не знаем); importDraft — разобранные карточки на экране «Импорт» { name, format, cards }; game — идущий «Блиц» (game/newGame); quest — идущий «Квест» (game/newQuest); sheet — режим, для которого раскрыто меню выбора колоды (null — закрыто); quiz — вопрос с выбором / вводом для текущей карточки (null — обычный переворот); speech — последняя попытка произношения
 * { id, heard, score, attempts }; listening — микрофон слушает; awake — экран удерживается включённым;
 * anim — анимация ближайшей отрисовки; page/landing/pager — постраничный вывод.
 */
export const state = {
  nav: { v: 'library' }, stack: [], session: null, quiz: null, speechChecked: {}, iconLevel: null, importDraft: null, game: null, quest: null, sheet: null, speech: null, listening: false, revealed: false, awake: false, anim: '',
  page: 0, landing: null, pager: { items: [], titles: [], fixed: false },
  prefs: { ...DEFAULT_PREFS }
};
