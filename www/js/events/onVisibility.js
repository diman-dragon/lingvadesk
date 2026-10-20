import trackPause from '../study/trackPause.js';
import trackResume from '../study/trackResume.js';
import syncIcon from '../study/syncIcon.js';
/** Свернули приложение — время на карточке стоит; вернулись — идёт дальше и пересчитывается значок. */
export default function onVisibility() {
  if (document.hidden) return trackPause();
  syncIcon();
  return trackResume();
}
