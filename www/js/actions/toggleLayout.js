import { state } from '../state/appState.js';
import savePref from '../settings/savePref.js';
import render from '../nav/render.js';
export default async function toggleLayout() {
  await savePref('layout', state.prefs.layout === 'grid' ? 'list' : 'grid');
  return render();
}
