import { gameTimer } from '../state/gameTimer.js';
export default function stopGameTimer() { clearInterval(gameTimer.id); gameTimer.id = 0; }
