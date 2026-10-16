import { state } from '../state/appState.js';
import savePref from '../settings/savePref.js';
import render from '../nav/render.js';
/** Универсальная смена настройки: data-key + data-v. */
export default async function setPref(d) { await savePref(d.key, d.v); state.quiz = null; return render(); }
