import { state } from '../state/appState.js';
import go from '../nav/go.js';
export default function newCard() { return go('cardForm', { deckId: state.nav.id }); }
