import { state } from '../state/appState.js';
import speakText from '../tts/speakText.js';
export default function speak(d) { return speakText(d.t, state.session.deck.tts); }
