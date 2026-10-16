import { state } from '../state/appState.js';
/** Направление этой карточки: «вперемешку» — случайное, но неизменное, пока идёт сессия. */
export default function cardDir(session, card) {
  const pref = state.prefs.dir;
  if (pref !== 'mix') return pref;
  return (session.dirs[card.id] ??= Math.random() < 0.5 ? 'fwd' : 'rev');
}
