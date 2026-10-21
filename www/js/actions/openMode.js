import go from '../nav/go.js';
/** Нажали на режим учёбы: открыть экран с колодами этого режима (data-id — режим), «Назад» вернёт на вкладку «Учёба». */
export default function openMode(d) { return go('studyDecks', { mode: d.id }); }
