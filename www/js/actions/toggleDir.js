import { state } from '../state/appState.js';
import savePref from '../settings/savePref.js';
import render from '../nav/render.js';
const ORDER = ['fwd', 'rev', 'mix'];
/** Я→П → П→Я → вперемешку. */
export default async function toggleDir() {
  await savePref('dir', ORDER[(ORDER.indexOf(state.prefs.dir) + 1) % ORDER.length]);
  if (state.session) state.session.dirs = {};
  state.revealed = false;
  state.quiz = null;
  return render();
}
