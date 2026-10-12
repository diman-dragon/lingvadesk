import setSetting from '../settings/setSetting.js';
export default function saveState({ key, order, pos, phase, total }) {
  return setSetting(key, JSON.stringify({ order, pos, phase, total }));
}
