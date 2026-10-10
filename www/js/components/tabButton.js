import button from './button.js';
export default function tabButton({ act, icon, label, active }) {
  return button({ act, cls: `tab${active ? ' on' : ''}`, label: `<span class="ti">${icon}</span><span>${label}</span>` });
}
