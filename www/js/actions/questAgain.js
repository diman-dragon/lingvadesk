import { state } from '../state/appState.js';
import openQuest from '../game/openQuest.js';
/** «Ещё раз» после квеста: та же область, новый маршрут. */
export default function questAgain() { return openQuest(state.quest.scope); }
