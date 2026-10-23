import markStudied from '../study/markStudied.js';
import show from './show.js';
/** Сцена закончилась: итог (сколько своих реплик произнесено и с какой точностью); считается «позанимались». */
export default async function finishDialog(d) {
  d.phase = 'done';
  d.playing = false;
  d.waiting = false;
  markStudied();
  await show();
}
