import { state } from '../state/appState.js';
import currentCard from './currentCard.js';
import isIntro from './isIntro.js';
import speakText from '../tts/speakText.js';
/** Автоозвучка слова языка: в знакомстве — сразу; иначе при показе (Я→П) или при переворачивании (П→Я). */
export default async function autoSpeak(trigger) {
  const { session, prefs } = state;
  const card = session && currentCard(session);
  if (!card || prefs.autoplay !== 'on') return;
  const fwd = prefs.dir === 'fwd';
  const speak = isIntro(session) ? trigger === 'show' : fwd ? trigger === 'show' : trigger === 'reveal';
  if (speak) await speakText(card.front, session.deck.tts);
}
