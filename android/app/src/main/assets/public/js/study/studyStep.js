import { state } from '../state/appState.js';
import render from '../nav/render.js';
import autoSpeak from './autoSpeak.js';
/** Операция над сессией → закрыть ответ → перерисовать с анимацией (card-in вперёд / card-back назад). */
export default async function studyStep(op, anim = 'card-in') {
  await op(state.session);
  state.revealed = false;
  state.anim = anim;
  await render();
  await autoSpeak('show');
}
