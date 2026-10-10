import saveDeckState from '../repo/saveDeckState.js';
export default function saveState({ deck, mode, pos, order, intro }) {
  const payload = mode === 'learn' ? { order, intro } : order;
  return saveDeckState(deck.id, mode, pos, JSON.stringify(payload));
}
