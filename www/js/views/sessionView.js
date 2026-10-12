import { state } from '../state/appState.js';
import { MODE_SHORT } from '../constants/MODE_SHORT.js';
import { DIR_LABELS } from '../constants/DIR_LABELS.js';
import currentCard from '../study/currentCard.js';
import isIntro from '../study/isIntro.js';
import progressOf from '../study/progressOf.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import button from '../components/button.js';
import progressBar from '../components/progressBar.js';
import studyFace from './studyFace.js';
import studyControls from './studyControls.js';
import studyIntroControls from './studyIntroControls.js';
import studyFinishedView from './studyFinishedView.js';
/** Экран учёбы: всё помещается без прокрутки; карточки листаются по кругу. */
export default async function sessionView() {
  const s = state.session, card = currentCard(s), dir = state.prefs.dir, intro = isIntro(s);
  const head = header(MODE_SHORT[s.mode], {
    left: backButton('back'), gear: false,
    right: button({ act: 'toggleDir', cls: 'sm', label: DIR_LABELS[dir][1] })
  });
  if (!card) return head + studyFinishedView(s);
  const controls = intro ? studyIntroControls() : studyControls(s, state.revealed);
  return head + progressBar(progressOf(s), `${card.pname} · ${card.dname}`) +
    studyFace(card, intro || state.revealed, dir) + `<div id="controls">${controls}</div>`;
}
