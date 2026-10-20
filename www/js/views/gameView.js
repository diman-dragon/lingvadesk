import { state } from '../state/appState.js';
import { GAME } from '../constants/GAME.js';
import esc from '../util/esc.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import button from '../components/button.js';
import big from '../components/big.js';
import row from '../components/row.js';
import faceBox from '../components/faceBox.js';
import bestScore from '../repo/bestScore.js';
const mark = (q, i) => (q.picked === null ? '' : q.options[i] === q.answer ? ' ok' : q.picked === i ? ' bad' : '');
/** Конец игры: очки, рекорд, точность; «К учёбе» и «Ещё раз». */
const result = async g => {
  const total = g.correct + g.wrong, acc = total ? Math.round(100 * g.correct / total) : 0, best = await bestScore();
  return faceBox(`<div class="muted">${g.record ? '🏆 Новый рекорд!' : 'Игра окончена'}</div><div class="big">${g.score}</div>` +
    `<div class="sum"><div><b>${g.correct}</b><span>верно</span></div><div><b>${acc}%</b><span>точность</span></div><div><b>×${g.bestCombo}</b><span>лучший комбо</span></div></div>` +
    `<div class="muted">Рекорд: ${best}</div>`) + row(button({ act: 'back', label: 'К учёбе' }) + button({ act: 'gameAgain', cls: 'p', label: 'Ещё раз' }));
};
/** «Блиц»: таймер, жизни, очки с комбо, вопрос и 4 варианта. */
export default async function gameView() {
  const g = state.game, left = Math.max(0, g.endsAt - Date.now());
  const head = header('Игра', { left: backButton('back'), gear: false });
  if (g.over) return head + await result(g);
  const q = g.q, hearts = '❤️'.repeat(g.lives) + '🖤'.repeat(GAME.lives - g.lives);
  const opts = q.options.map((t, i) => button({ act: 'gamePick', cls: `opt${mark(q, i)}`, label: esc(t), data: { i } })).join('');
  return head + `<div class="ghud"><span>${hearts}</span><b>${g.score}</b><span class="combo">${g.combo > 1 ? `×${Math.min(g.combo, GAME.comboMax)} комбо` : ''}</span><span id="gsec">${Math.ceil(left / 1000)}</span></div>` +
    `<div class="prog"><i id="gtime" style="width:${left / (GAME.seconds * 10)}%"></i></div>` +
    faceBox(`<div class="muted">Выберите перевод</div>${big(q.prompt)}`) + `<div class="opts">${opts}</div>`;
}
