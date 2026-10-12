import { state } from '../state/appState.js';
import deleteProject from '../repo/deleteProject.js';
import toast from '../dom/toast.js';
import go from '../nav/go.js';
export default async function delProject() {
  if (!confirm('Удалить проект со всеми колодами и карточками?')) return;
  await deleteProject(state.nav.id);
  state.session = null;
  toast('Проект удалён');
  return go('library');
}
