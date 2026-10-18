import speakText from '../tts/speakText.js';
import trackPlay from '../study/trackPlay.js';
import pulse from '../dom/pulse.js';
/** «Прослушать» в режиме «На слух»: слово произносится, повторное нажатие учитывается как признак трудности. */
export default function play(d, el) { trackPlay(); pulse(el); return speakText(d.t, d.lang || 'en-US'); }
