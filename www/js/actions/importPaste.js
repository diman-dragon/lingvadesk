import { state } from '../state/appState.js';
import go from '../nav/go.js';
/** «Вставить текст»: экран «Импорт» с полем для вставки. */
export default function importPaste() {
  state.importDraft = null;
  return go('importForm');
}
