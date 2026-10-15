import { track } from '../state/trackState.js';
import currentCard from './currentCard.js';
/** Новая карточка на экране: счётчики с нуля. revisit — пользователь вернулся к ней свайпом назад. */
export default function trackShow(session, revisit = false) {
  Object.assign(track, { live: !!currentCard(session), side: 'front', since: Date.now(), front: 0, back: 0, think: null, flips: 0, revisit, away: false });
}
