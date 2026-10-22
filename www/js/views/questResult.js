import { QUEST } from '../constants/QUEST.js';
import bestScore from '../repo/bestScore.js';
import button from '../components/button.js';
import row from '../components/row.js';
import faceBox from '../components/faceBox.js';
/** Итог квеста: победа / поражение, звёзды (по оставшимся жизням), очки, верные этапы, рекорд; «К учёбе» и «Ещё раз». */
export default async function questResult(q) {
  const stars = q.won ? '⭐'.repeat(q.lives) + '☆'.repeat(QUEST.lives - q.lives) : '', best = await bestScore('quest');
  return faceBox(`<div class="muted">${q.won ? 'Квест пройден!' : 'Квест не пройден'}${q.record ? ' · 🏆 Новый рекорд!' : ''}</div>${stars ? `<div class="big">${stars}</div>` : ''}<div class="big">${q.score}</div>` +
    `<div class="sum"><div><b>${q.correct}</b><span>верно</span></div><div><b>${q.wrong}</b><span>ошибок</span></div><div><b>${q.stages.length}</b><span>этапов</span></div></div>` +
    `<div class="muted">Рекорд квеста: ${best}</div>`) + row(button({ act: 'back', label: 'К учёбе' }) + button({ act: 'questAgain', cls: 'p', label: 'Ещё раз' }));
}
