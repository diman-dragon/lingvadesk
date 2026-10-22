import { track } from '../state/trackState.js';
import fitFaces from '../dom/fitFaces.js';
import buzz from '../dom/buzz.js';
/** «Показать текст» — подсказка в режиме «На слух»: слово появляется на карточке, ответ засчитывается как подсказанный. */
export default function showText() {
  const text = document.querySelector('.hidtext'), btn = document.querySelector('.showtext');
  if (text) text.hidden = false;
  if (btn) btn.hidden = true;
  fitFaces();
  track.hinted = true;
  buzz();
}
