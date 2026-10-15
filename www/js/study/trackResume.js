import { track } from '../state/trackState.js';
export default function trackResume() { if (track.live && !track.since) track.since = Date.now(); }
