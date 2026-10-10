import { state } from '../state/appState.js';
import openStudy from '../study/openStudy.js';
export default function startStudy(d) { return openStudy(state.nav.id, d.mode); }
