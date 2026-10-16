import { state } from '../state/appState.js';
import { MODE_SHORT } from '../constants/MODE_SHORT.js';
import { DIR_LABELS } from '../constants/DIR_LABELS.js';
import currentCard from '../study/currentCard.js';
import isIntro from '../study/isIntro.js';
import cardDir from '../study/cardDir.js';
import makeQuiz from '../study/makeQuiz.js';
import progressOf from '../study/progressOf.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import button from '../components/button.js';
import progressBar from '../components/progressBar.js';
import studyFace from './studyFace.js';
import studyControls from './studyControls.js';
import quizControls from './quizControls.js';
import studyIntroControls from './studyIntroControls.js';
import studyFinishedView from './studyFinishedView.js';
/** Экран учёбы: всё помещается без прокрутки. В шапке: 🎲 — другая колода проекта, ↶ — отменить последнюю оценку, направление. */
export default async function sessionView() {
  const s = state.session, card = currentCard(s), pref = state.prefs.dir;
  const other = s.mode === 'review' && s.origin.startsWith('p:') ? button({ act: 'restart', cls: 'sm', label: '🎲', aria: 'Другая колода' }) : '';
  const undo = s.undo ? button({ act: 'undo', cls: 'sm', label: '↶', aria: 'Отменить последнюю оценку' }) : '';
  const head = header(MODE_SHORT[s.mode], { left: backButton('back'), gear: false, right: other + undo + button({ act: 'toggleDir', cls: 'sm', label: DIR_LABELS[pref][1] }) });
  if (!card) return head + studyFinishedView(s);
  const dir = cardDir(s, card);
  if (state.quiz?.id !== card.id) state.quiz = makeQuiz(s, card, dir, state.prefs.check);
  const q = state.quiz, intro = isIntro(s);
  const controls = intro ? studyIntroControls() : q ? quizControls(q) : studyControls();
  return head + progressBar(progressOf(s), `${card.pname} · ${card.dname}`) +
    studyFace(card, intro || state.revealed || !!q?.result, dir, q) + `<div id="controls">${controls}</div>`;
}
