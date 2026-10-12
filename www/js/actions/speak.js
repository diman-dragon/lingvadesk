import speakText from '../tts/speakText.js';
export default function speak(d) { return speakText(d.t, d.lang || 'en-US'); }
