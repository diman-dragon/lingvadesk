import { GRADES } from '../constants/GRADES.js';
import previewLabel from '../srs/previewLabel.js';
import currentCard from '../study/currentCard.js';
import button from '../components/button.js';
import row from '../components/row.js';
/** «Повторение» и до ответа — листание и переворот; после ответа — 4 оценки с подписью «когда вернётся». */
export default function studyControls(session, revealed) {
  if (!revealed || session.mode === 'review') {
    const label = session.mode === 'review' ? 'Перевернуть' : 'Показать ответ';
    return row(button({ act: 'prev', cls: 'icon', label: '‹' }) + button({ act: 'flip', cls: 'p wide', label }) + button({ act: 'skip', cls: 'icon', label: '›' }), 'nav-row');
  }
  const card = currentCard(session);
  const label = x => `<b>${x.label}</b><small>${previewLabel(card, x.g)}</small>`;
  return row(GRADES.map(x => button({ act: 'grade', cls: `grade ${x.cls}`, label: label(x), data: { g: x.g } })).join(''), 'grade-grid');
}
