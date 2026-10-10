import { state } from '../state/appState.js';
import deleteCourse from '../repo/deleteCourse.js';
import toast from '../dom/toast.js';
import go from '../nav/go.js';
export default async function delCourse() {
  if (!confirm('Удалить курс со всеми колодами и карточками?')) return;
  await deleteCourse(state.nav.id);
  state.session = null;
  toast('Курс удалён');
  return go('library');
}
