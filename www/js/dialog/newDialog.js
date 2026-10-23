import { DIALOG } from '../constants/DIALOG.js';
import rolesOf from './rolesOf.js';
/**
 * Сцена из колоды-диалога и её реплик (карточек по порядку): { deckId, name, lang, lines[{ id, role, front, back, example }], you, phase, i, playing, waiting, runId, heard, results[] }.
 * you — роль пользователя (0 — только слушает); по умолчанию роль 3, если она есть в сцене. phase: 'setup' | 'run' | 'done'.
 * Реплика без роли считается репликой роли 1.
 */
export default function newDialog(deck, cards) {
  const lines = cards.map(c => ({ id: c.id, role: c.speaker || 1, front: c.front, back: c.back, example: c.example || '' }));
  if (!lines.length) throw new Error('В диалоге нет реплик');
  return {
    deckId: deck.id, name: deck.name, lang: deck.tts, lines, you: rolesOf(lines).includes(DIALOG.you) ? DIALOG.you : 0,
    phase: 'setup', i: 0, playing: false, waiting: false, runId: 0, heard: null, listening: false, results: []
  };
}
