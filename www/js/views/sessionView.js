import { state } from '../state/appState.js';
import { MODE_SHORT } from '../constants/MODE_SHORT.js';
import { DIR_LABELS } from '../constants/DIR_LABELS.js';
import currentCard from '../study/currentCard.js';
import cardDir from '../study/cardDir.js';
import makeQuiz from '../study/makeQuiz.js';
import progressOf from '../study/progressOf.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import button from '../components/button.js';
import progressBar from '../components/progressBar.js';
import studyFace from './studyFace.js';
import listenFace from './listenFace.js';
import studyControls from './studyControls.js';
import quizControls from './quizControls.js';
import studyFinishedView from './studyFinishedView.js';
/** Экран учёбы: всё помещается без прокрутки. В шапке: ↶ — отменить последнюю оценку, направление (только в повторении). */
export default async function sessionView() {
  const s = state.session, card = currentCard(s), listen = s.mode === 'listen';
  const undo = s.undo ? button({ act: 'undo', cls: 'sm', label: '↶', aria: 'Отменить последнюю оценку' }) : '';
  const dirBtn = listen ? '' : button({ act: 'toggleDir', cls: 'sm', label: DIR_LABELS[state.prefs.dir][1] });
  const head = header(MODE_SHORT[s.mode], { left: backButton('back'), gear: false, right: undo + dirBtn });
  if (!card) return head + studyFinishedView(s);
  const dir = cardDir(s, card);
  if (state.quiz?.id !== card.id) state.quiz = makeQuiz(s, card, dir, state.prefs.check);
  const q = state.quiz, flipped = state.revealed || !!q?.result;
  return head + progressBar(progressOf(s), `${card.pname} · ${card.dname}`) +
    (listen ? listenFace(card, flipped, q) : studyFace(card, flipped, dir, q)) + `<div id="controls">${q ? quizControls(q) : studyControls()}</div>`;
}
