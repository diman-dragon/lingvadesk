import { TTS_CODES } from '../constants/TTS_CODES.js';
export default function ttsCodes() {
  return `<datalist id="tts-codes">${TTS_CODES.map(c => `<option value="${c}">`).join('')}</datalist>`;
}
