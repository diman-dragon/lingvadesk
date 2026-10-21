import { state } from '../state/appState.js';
/** Число страниц (после layoutPager). */
export default function pageCount() { return Math.max(1, state.pager.starts?.length ?? 1); }
