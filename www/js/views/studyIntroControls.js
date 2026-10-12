import button from '../components/button.js';
import row from '../components/row.js';
/** Знакомство: листание по кругу и переход к проверке. */
export default function studyIntroControls() {
  return row(button({ act: 'prev', cls: 'icon', label: '‹' }) + button({ act: 'startQuiz', cls: 'p wide', label: 'К проверке' }) + button({ act: 'skip', cls: 'icon', label: '›' }), 'nav-row');
}
