import { state } from '../state/appState.js';
import getDeckWithCourse from '../repo/getDeckWithCourse.js';
import listCourses from '../repo/listCourses.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import labeledField from '../components/labeledField.js';
import selectField from '../components/selectField.js';
import formButtons from '../components/formButtons.js';
export default async function deckFormView() {
  const id = state.nav.id;
  const [deck, courses] = await Promise.all([id ? getDeckWithCourse(id) : null, listCourses()]);
  const courseId = deck ? deck.language_id : state.nav.courseId;
  return header(id ? 'Колода' : 'Новая колода', { left: backButton('back') }) +
    labeledField({ id: 'name', label: 'Название', value: deck?.name ?? '', placeholder: 'Например, Договоры' }) +
    selectField({ id: 'course', label: 'Курс', options: courses.map(c => [c.id, c.name]), value: courseId }) +
    formButtons({ save: 'saveDeck', del: id ? 'delDeck' : '' });
}
