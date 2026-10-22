import { GAMES } from '../constants/GAMES.js';
import bestScore from '../repo/bestScore.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import layoutToggle from '../components/layoutToggle.js';
import gameEntry from '../components/gameEntry.js';
import pagedList from '../components/pagedList.js';
/** Категория «Игры»: все игры списком или сеткой с рекордом каждой; нажатие — выбор колоды и старт. */
export default async function gamesView() {
  const bests = await Promise.all(GAMES.map(g => bestScore(g.kind)));
  return header('🎮 Игры', { left: backButton('back'), right: layoutToggle() }) + pagedList(GAMES.map((g, i) => gameEntry(g, bests[i])));
}
