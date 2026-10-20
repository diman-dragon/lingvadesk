import { state } from '../state/appState.js';
import render from '../nav/render.js';
/** Нажали на режим: раскрыть меню выбора колоды (data-mode). */
export default function openSheet(d) { state.sheet = d.mode; return render(); }
