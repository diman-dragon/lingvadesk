import { appEl } from './dom/appEl.js';
import loadPrefs from './settings/loadPrefs.js';
import applyPrefs from './settings/applyPrefs.js';
import watchSystemTheme from './events/watchSystemTheme.js';
import installBackGuard from './nav/installBackGuard.js';
import bindEvents from './events/bindEvents.js';
import render from './nav/render.js';
export default async function boot() {
  try {
    await loadPrefs();
    applyPrefs();
    watchSystemTheme();
    installBackGuard();
    bindEvents();
    await render();
  } catch (e) { appEl.textContent = 'Ошибка запуска: ' + (e.message || e); }
}
