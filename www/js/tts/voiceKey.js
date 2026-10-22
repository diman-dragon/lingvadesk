/** Ключ выбранного голоса в таблице settings: язык озвучки + слот (роль) голоса. */
export default function voiceKey(lang, slot = 0) { return `voice:${lang}:${slot}`; }
