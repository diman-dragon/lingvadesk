import { state } from '../state/appState.js';
import startStudy from './startStudy.js';
/** Нажали на колоду (или «Все колоды») в выбранном режиме: data-id — область ('all' | 'd:<id>'), режим берётся с экрана. */
export default function pickScope(d) { return startStudy({ mode: state.nav.mode, scope: d.id }); }
