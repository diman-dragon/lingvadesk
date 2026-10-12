import { state } from '../state/appState.js';
export default function pageCount() {
  const { items, per } = state.pager;
  return Math.max(1, Math.ceil(items.length / (per || 1)));
}
