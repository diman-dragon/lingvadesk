import plugin from './plugin.js';
/** opts — { voice (имя голоса, '' — по умолчанию), rate, pitch }. */
export default function ttsSpeak(text, lang, opts = {}) { return plugin('TtsSpeak').exec({ text, lang, ...opts }); }
