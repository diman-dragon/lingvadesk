import { state } from '../state/appState.js';
import go from '../nav/go.js';
export default function editProject() { return go('projectForm', { id: state.nav.id }); }
