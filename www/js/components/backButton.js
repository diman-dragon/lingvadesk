import button from './button.js';
export default function backButton(act, id) { return button({ act, cls: 'icon', label: '‹', data: id == null ? {} : { id } }); }
