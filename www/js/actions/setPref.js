import savePref from '../settings/savePref.js';
import render from '../nav/render.js';
/** Универсальная смена настройки: data-key + data-v. */
export default async function setPref(d) { await savePref(d.key, d.v); return render(); }
