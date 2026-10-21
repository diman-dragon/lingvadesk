import { state } from '../state/appState.js';
import render from '../nav/render.js';
/** Нажали на параметр статистики: открыть подробное окно (data-id — номер параметра). */
export default function openStat(d) { state.sheet = `stat:${d.id}`; return render(); }
