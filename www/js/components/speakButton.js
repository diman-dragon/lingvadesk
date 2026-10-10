import button from './button.js';
export default function speakButton(text) { return button({ act: 'speak', cls: 'sm', label: '🔊', data: { t: text } }); }
