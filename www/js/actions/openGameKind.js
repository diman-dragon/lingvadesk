import go from '../nav/go.js';
/** Нажали на игру на экране «Игры» (data-id — режим из constants/GAMES): открыть выбор колоды. */
export default function openGameKind(d) { return go('studyDecks', { mode: d.id }); }
