import { state } from '../state/appState.js';
import render from '../nav/render.js';
/** Нажали на режим: раскрыть меню выбора колоды (data-id — режим). */
export default function openSheet(d) { state.sheet = d.id; return render(); }
