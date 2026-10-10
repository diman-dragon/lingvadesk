import { state } from '../state/appState.js';
import readField from '../dom/readField.js';
import toast from '../dom/toast.js';
import insertDeck from '../repo/insertDeck.js';
import updateDeck from '../repo/updateDeck.js';
import goBack from '../nav/goBack.js';
export default async function saveDeck() {
  const name = readField('name'), courseId = +readField('course'), id = state.nav.id;
  if (!name) return toast('Введите название колоды');
  if (!courseId) return toast('Сначала создайте курс');
  await (id ? updateDeck(id, name, courseId) : insertDeck(courseId, name));
  toast('Сохранено');
  return goBack();
}
