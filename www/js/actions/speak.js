import speakText from '../tts/speakText.js';
import pulse from '../dom/pulse.js';
export default function speak(d, el) { pulse(el); return speakText(d.t, d.lang || 'en-US'); }
