import { state } from '../state/appState.js';
import openGame from '../game/openGame.js';
/** «Ещё раз» после игры: та же область. */
export default function gameAgain() { return openGame(state.game.scope); }
