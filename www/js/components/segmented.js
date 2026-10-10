import button from './button.js';
/** Переключатель-сегмент: options = [[значение, подпись], ...]. */
export default function segmented(key, options, current) {
  const items = options.map(([v, label]) => button({ act: 'setPref', cls: v === current ? 'on' : '', label, data: { key, v } }));
  return `<div class="seg">${items.join('')}</div>`;
}
