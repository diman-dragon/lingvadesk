import pickDeck from './pickDeck.js';
/** Область сессии: интервальное повторение и обучение — выбранная область (вся библиотека / проект / колода); случайная колода — выбранная или случайная из проекта. */
export default async function scopeFor(mode, picked) { return mode === 'review' ? pickDeck(picked) : picked; }
