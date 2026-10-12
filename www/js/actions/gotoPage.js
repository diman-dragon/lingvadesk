import { state } from '../state/appState.js';
import setPage from '../pager/setPage.js';
export default function gotoPage(d) { return setPage(+d.i, +d.i > state.page ? 'to-next' : 'to-prev'); }
