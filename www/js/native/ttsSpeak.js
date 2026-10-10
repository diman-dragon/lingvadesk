import plugin from './plugin.js';
export default function ttsSpeak(text, lang) { return plugin('TtsSpeak').exec({ text, lang }); }
