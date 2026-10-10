import { DEFAULT_PREFS } from '../constants/DEFAULT_PREFS.js';
/** anim: 'view-in' | 'card-in' | '' — какую анимацию проиграть при ближайшей отрисовке. */
export const state = { nav: { v: 'today' }, session: null, revealed: false, anim: '', prefs: { ...DEFAULT_PREFS } };
