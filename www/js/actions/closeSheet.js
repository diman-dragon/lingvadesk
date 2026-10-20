import { state } from '../state/appState.js';
import render from '../nav/render.js';
export default function closeSheet() { state.sheet = null; return render(); }
