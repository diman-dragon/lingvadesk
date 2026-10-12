import { state } from '../state/appState.js';
import go from '../nav/go.js';
export default function newDeck() { return go('deckForm', { projectId: state.nav.id }); }
