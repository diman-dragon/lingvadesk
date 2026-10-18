import { state } from '../state/appState.js';
import openStudy from '../study/openStudy.js';
/** Режим — из настройки на вкладке «Учёба»; область — data-scope ('all' | 'p:<id>' | 'd:<id>') или колода data-id. */
export default function startStudy(d) { return openStudy(state.prefs.mode, d.scope ?? `d:${d.id}`); }
