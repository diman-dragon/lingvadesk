import { state } from '../state/appState.js';
import voiceKey from './voiceKey.js';
/** Имя выбранного голоса для языка и слота; '' — голос по умолчанию. */
export default function resolveVoice(lang, slot = 0) { return state.voices[voiceKey(lang, slot)] || ''; }
