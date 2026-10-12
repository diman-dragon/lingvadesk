import { state } from '../state/appState.js';
import toggleFlip from '../dom/toggleFlip.js';
import showGrades from '../study/showGrades.js';
import autoSpeak from '../study/autoSpeak.js';
import isIntro from '../study/isIntro.js';
/** Переворот сколько угодно раз; оценки (кроме «Повторения» и знакомства) появляются при первом открытии ответа. */
export default async function flip() {
  const showingBack = toggleFlip();
  if (!showingBack || state.revealed) return;
  state.revealed = true;
  const s = state.session;
  if (s.mode !== 'review' && !isIntro(s)) showGrades(s);
  await autoSpeak('reveal');
}
