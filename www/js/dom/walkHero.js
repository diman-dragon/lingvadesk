import { state } from '../state/appState.js';
/** Герой квеста идёт к узлу: он нарисован на старом месте (data-to — цель), здесь запускается переход CSS и сбрасывается q.walking. */
export default function walkHero() {
  const h = document.getElementById?.('hero'), to = h?.dataset?.to;
  if (state.quest) state.quest.walking = false;
  if (!to || !h.style) return;
  h.getBoundingClientRect?.();
  h.style.transform = `translate(${to})`;
}
