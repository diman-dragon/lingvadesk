import pickDeck from './pickDeck.js';
/** Область сессии: интервальное повторение — всегда все колоды; случайная колода — выбранная или случайная из проекта; обучение — выбранная область. */
export default async function scopeFor(mode, picked) {
  if (mode === 'srs') return 'all';
  return mode === 'review' ? pickDeck(picked) : picked;
}
