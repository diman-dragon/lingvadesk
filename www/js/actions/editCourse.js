import { state } from '../state/appState.js';
import go from '../nav/go.js';
export default function editCourse() { return go('courseForm', { id: state.nav.id }); }
