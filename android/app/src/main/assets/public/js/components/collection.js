import { state } from '../state/appState.js';
export default function collection(itemsHtml) { return `<div class="collection ${state.prefs.layout}">${itemsHtml}</div>`; }
