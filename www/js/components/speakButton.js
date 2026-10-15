import button from './button.js';
import speakIcon from './speakIcon.js';
/** Круглая кнопка озвучки: size 'lg' — на карточке, 'sm' — у примера; lang — голос проекта (BCP-47). */
export default function speakButton(text, lang, size = 'lg') {
  return button({ act: 'speak', cls: `speak ${size}`, label: speakIcon(), aria: 'Озвучить', data: { t: text, lang } });
}
