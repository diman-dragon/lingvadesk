import { swipe } from './swipeState.js';
import actions from '../actions/index.js';
import buzz from '../dom/buzz.js';
/** Долгое нажатие на карточку, не сдвинув палец: правка карточки; клик, следующий за отпусканием, гасится. */
export default function holdCard() {
  swipe.hold = 0;
  if (!swipe.el || swipe.moved || swipe.kind !== 'card') return;
  swipe.el = null;
  swipe.suppress = true;
  buzz(25);
  return actions.editSessionCard();
}
