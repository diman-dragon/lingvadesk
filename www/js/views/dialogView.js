import { state } from '../state/appState.js';
import esc from '../util/esc.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import roleNames from '../dialog/roleNames.js';
import dialogRoles from './dialogRoles.js';
import dialogChat from './dialogChat.js';
import dialogControls from './dialogControls.js';
import dialogDone from './dialogDone.js';
/** Экран «Диалоги»: настройка ролей → сцена (чат реплик, озвучка по ролям, ваша реплика с микрофоном) → итог. */
export default async function dialogView() {
  const d = state.dialog, head = header(d.name, { left: backButton('back') });
  if (d.phase === 'setup') return head + await dialogRoles(d);
  if (d.phase === 'done') return head + dialogDone(d);
  const pct = Math.round(100 * (d.i + 1) / d.lines.length);
  return head + `<div class="counter"><span>Реплика ${d.i + 1} из ${d.lines.length}</span><span class="ctx">${esc(d.lang)}</span></div><div class="prog"><i style="width:${pct}%"></i></div>` +
    dialogChat(d, await roleNames(d)) + dialogControls(d);
}
