import { state } from '../state/appState.js';
import navItem from './navItem.js';
import navTile from './navTile.js';
/** Элемент библиотеки в выбранном виде (список / сетка) — для проектов, колод и карточек. */
export default function entry(item) { return state.prefs.layout === 'grid' ? navTile(item) : navItem(item); }
