import { state } from '../state/appState.js';
import deleteProject from '../repo/deleteProject.js';
import toast from '../dom/toast.js';
import go from '../nav/go.js';
/** 🗑 у проекта в списке (data-id) или «Удалить» в форме проекта (текущий экран). */
export default async function delProject(d) {
  if (!confirm('Удалить проект со всеми колодами и карточками?')) return;
  await deleteProject(d?.id ? +d.id : state.nav.id);
  state.session = null;
  toast('Проект удалён');
  return go('library');
}
