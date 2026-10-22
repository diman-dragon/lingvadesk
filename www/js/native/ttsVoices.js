import plugin from './plugin.js';
/** Голоса синтезатора устройства: { voices: [{ name, lang, quality, offline }] }. */
export default function ttsVoices() { return plugin('TtsVoices').exec({}); }
