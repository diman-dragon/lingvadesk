import { state } from '../state/appState.js';
import toggleFlip from '../dom/toggleFlip.js';
import trackFlip from '../study/trackFlip.js';
import autoSpeak from '../study/autoSpeak.js';
/** Переворот сколько угодно раз; каждый переворот — сигнал для оценки; озвучка по ответу — при первом открытии. */
export default async function flip() {
  const showingBack = toggleFlip();
  trackFlip();
  if (!showingBack || state.revealed) return;
  state.revealed = true;
  await autoSpeak('reveal');
}
