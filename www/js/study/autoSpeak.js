import { state } from '../state/appState.js';
import currentCard from './currentCard.js';
import cardDir from './cardDir.js';
import speakText from '../tts/speakText.js';
/** Озвучка слова: «На слух» — при показе карточки всегда; иначе по настройке — при показе (Я→П) или при открытии ответа (П→Я). */
export default async function autoSpeak(trigger) {
  const { session, prefs } = state;
  const card = session && currentCard(session);
  if (!card) return;
  if (session.mode === 'speak') return;                         // «Говорить»: слово не подсказываем
  const listen = session.mode === 'listen';
  if (!listen && prefs.autoplay !== 'on') return;
  if (listen ? trigger === 'show' : cardDir(session, card) === 'fwd' ? trigger === 'show' : trigger === 'reveal') await speakText(card.front, card.tts);
}
