import plugin from './plugin.js';
/** Офлайн-пакет языка распознавания: 'check' → { checked, installed, supported, pending, online }; 'download' → { started } (или { settings } на Android < 13). */
export default function speechPack(action, lang) { return plugin('SpeechListen').exec({ action, lang }); }
