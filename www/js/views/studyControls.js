import { GRADES } from '../constants/GRADES.js';
import previewLabel from '../srs/previewLabel.js';
import button from '../components/button.js';
import row from '../components/row.js';
/** До ответа — навигация; после — «Перевернуть» и 4 оценки с подписью «когда вернётся». */
export default function studyControls(revealed, card) {
  if (!revealed) {
    return row(button({ act: 'prev', cls: 'icon', label: '‹' }) + button({ act: 'flip', cls: 'p wide', label: 'Показать ответ' }) + button({ act: 'skip', cls: 'icon', label: '›' }), 'nav-row');
  }
  const label = x => `<b>${x.label}</b><small>${previewLabel(card, x.g)}</small>`;
  const grades = GRADES.map(x => button({ act: 'grade', cls: `grade ${x.cls}`, label: label(x), data: { g: x.g } })).join('');
  return row(button({ act: 'flip', cls: 'sm', label: '↻ Перевернуть' }), 'center') + row(grades, 'grade-grid');
}
