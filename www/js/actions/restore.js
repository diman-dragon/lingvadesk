import { state } from '../state/appState.js';
import restoreBackup from '../backup/restoreBackup.js';
import toast from '../dom/toast.js';
import go from '../nav/go.js';
export default async function restore() {
  if (!confirm('Заменить все данные содержимым копии? Текущая БД будет сохранена в защитную копию.')) return;
  const r = await restoreBackup();
  toast('Восстановлено. Защитная копия: ' + r.safety);
  state.session = null;
  return go('library');
}
