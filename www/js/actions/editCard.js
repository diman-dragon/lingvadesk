import { state } from '../state/appState.js';
import go from '../nav/go.js';
export default function editCard(d) { return go('cardForm', { id: +d.id, deckId: state.nav.id }); }
