import { state } from '../state/appState.js';
/** Направление этой карточки: «вперемешку» — случайное, но неизменное, пока идёт сессия. «На слух» и произношение — всегда слово → перевод. */
export default function cardDir(session, card) {
  const pref = state.prefs.dir;
  if (session.mode !== 'srs' && session.mode !== 'cards') return 'fwd';
  if (pref !== 'mix') return pref;
  return (session.dirs[card.id] ??= Math.random() < 0.5 ? 'fwd' : 'rev');
}
