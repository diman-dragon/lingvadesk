import button from '../components/button.js';
import row from '../components/row.js';
/** Знакомство: назад / дальше, без оценок. */
export default function studyIntroControls() {
  return row(button({ act: 'prev', cls: 'icon', label: '‹' }) + button({ act: 'skip', cls: 'p wide', label: 'Дальше' }), 'nav-row');
}
