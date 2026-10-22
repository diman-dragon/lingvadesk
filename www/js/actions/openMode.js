import go from '../nav/go.js';
/** Нажали на режим учёбы: экран колод этого режима; «Игры» — сначала экран выбора игры. «Назад» вернёт на вкладку «Учёба». */
export default function openMode(d) { return d.id === 'game' ? go('games') : go('studyDecks', { mode: d.id }); }
