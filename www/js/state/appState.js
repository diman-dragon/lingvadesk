import { DEFAULT_PREFS } from '../constants/DEFAULT_PREFS.js';
/**
 * nav — текущий экран; session — сессия учёбы; anim — какую анимацию проиграть при ближайшей отрисовке;
 * page/landing/pager — постраничный вывод (без прокрутки); scope — область учёбы: 'all' | 'p:<id>' | 'd:<id>'.
 */
export const state = {
  nav: { v: 'library' }, session: null, revealed: false, anim: '',
  page: 0, landing: null, pager: { items: [], titles: [], fixed: false },
  scope: 'all', prefs: { ...DEFAULT_PREFS }
};
