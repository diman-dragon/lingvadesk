import trackPause from '../study/trackPause.js';
import trackResume from '../study/trackResume.js';
/** Свернули приложение — время на карточке стоит; вернулись — идёт дальше. */
export default function onVisibility() { return document.hidden ? trackPause() : trackResume(); }
