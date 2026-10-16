import { DEFAULT_PREFS } from '../constants/DEFAULT_PREFS.js';
/**
 * nav — текущий экран; stack — пройденные экраны («Назад» снимает верхний); session — сессия учёбы;
 * quiz — вопрос с выбором / вводом для текущей карточки (null — обычный переворот); awake — экран удерживается включённым;
 * anim — анимация ближайшей отрисовки; page/landing/pager — постраничный вывод; scope — область учёбы.
 */
export const state = {
  nav: { v: 'library' }, stack: [], session: null, quiz: null, revealed: false, awake: false, anim: '',
  page: 0, landing: null, pager: { items: [], titles: [], fixed: false },
  scope: 'all', prefs: { ...DEFAULT_PREFS }
};
