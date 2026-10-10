import { state } from '../state/appState.js';
import resetProgressInDb from '../repo/resetProgress.js';
import toast from '../dom/toast.js';
export default async function resetProgress() {
  if (!confirm('Сбросить прогресс всех карточек? Колоды и карточки сохранятся.')) return;
  await resetProgressInDb();
  state.session = null;
  toast('Прогресс сброшен');
}
