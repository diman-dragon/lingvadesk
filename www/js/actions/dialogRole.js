import { state } from '../state/appState.js';
import render from '../nav/render.js';
/** Выбор своей роли на экране сцены (data-r: 0 — только слушать, 1…3 — играть эту роль). */
export default function dialogRole(d) { state.dialog.you = Number(d.r); return render(); }
