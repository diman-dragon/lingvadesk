import plugin from './plugin.js';
/** Одна попытка произношения: → { text, confidence (-1 — неизвестна), alternatives[], audio (null: записи не сохраняются) }. */
export default function speechListen(lang) { return plugin('SpeechListen').exec({ lang }); }
