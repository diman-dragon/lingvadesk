import { TABS } from '../constants/TABS.js';
import tabButton from './tabButton.js';
export default function tabBar(active) {
  return `<nav class="tabs">${TABS.map(t => tabButton({ ...t, active: t.id === active })).join('')}</nav>`;
}
