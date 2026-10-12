import button from './button.js';
/** lang — голос проекта (BCP-47). */
export default function speakButton(text, lang) { return button({ act: 'speak', cls: 'sm', label: '🔊', data: { t: text, lang } }); }
