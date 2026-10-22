import plugin from './plugin.js';
/** Открывает системный экран скачивания голосов синтезатора (один шаг из приложения). */
export default function ttsInstall() { return plugin('TtsInstall').exec({}); }
