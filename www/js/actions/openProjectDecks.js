import { state } from '../state/appState.js';
import go from '../nav/go.js';
/** Нажали на проект на экране режима: открыть его колоды (data-id — проект), режим сохраняется. */
export default function openProjectDecks(d) { return go('studyDecks', { mode: state.nav.mode, project: +d.id }); }
