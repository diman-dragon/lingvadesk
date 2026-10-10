import { state } from '../state/appState.js';
import savePref from '../settings/savePref.js';
import render from '../nav/render.js';
export default async function toggleDir() {
  await savePref('dir', state.prefs.dir === 'fwd' ? 'rev' : 'fwd');
  state.revealed = false;
  return render();
}
