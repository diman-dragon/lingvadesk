import { state } from '../state/appState.js';
import { DIALOG } from '../constants/DIALOG.js';
import readField from '../dom/readField.js';
import toast from '../dom/toast.js';
import insertDeck from '../repo/insertDeck.js';
import updateDeck from '../repo/updateDeck.js';
import goBack from '../nav/goBack.js';
export default async function saveDeck() {
  const name = readField('name'), projectId = +readField('project'), id = state.nav.id, kind = readField('kind') === DIALOG.kind ? DIALOG.kind : 'cards';
  if (!name) return toast('Введите название колоды');
  if (!projectId) return toast('Сначала создайте проект');
  await (id ? updateDeck(id, name, projectId, kind) : insertDeck(projectId, name, kind));
  toast('Сохранено');
  return goBack();
}
