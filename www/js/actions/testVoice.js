import { VOICE_SAMPLES } from '../constants/VOICE_SAMPLES.js';
import speakText from '../tts/speakText.js';
/** «▶» рядом с выбором голоса: проба фразой на языке (data-lang, data-slot). */
export default function testVoice(d) {
  return speakText(VOICE_SAMPLES[d.lang.split(/[-_]/)[0].toLowerCase()] ?? VOICE_SAMPLES.en, d.lang, Number(d.slot));
}
