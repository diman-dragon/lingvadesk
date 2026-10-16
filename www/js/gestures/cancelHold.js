import { swipe } from './swipeState.js';
export default function cancelHold() { clearTimeout(swipe.hold); swipe.hold = 0; }
