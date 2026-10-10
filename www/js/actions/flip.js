import { state } from '../state/appState.js';
import toggleFlip from '../dom/toggleFlip.js';
import showGrades from '../study/showGrades.js';
import autoSpeak from '../study/autoSpeak.js';
import isIntro from '../study/isIntro.js';
/** Переворот сколько угодно раз; оценки появляются при первом открытии ответа. */
export default async function flip() {
  const showingBack = toggleFlip();
  if (!showingBack || state.revealed || isIntro(state.session)) return;
  state.revealed = true;
  showGrades(state.session);
  await autoSpeak('reveal');
}
