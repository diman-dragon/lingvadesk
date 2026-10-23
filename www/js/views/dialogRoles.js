import { DIALOG } from '../constants/DIALOG.js';
import esc from '../util/esc.js';
import button from '../components/button.js';
import row from '../components/row.js';
import prefControl from '../components/prefControl.js';
import settingRow from '../components/settingRow.js';
import rolesOf from '../dialog/rolesOf.js';
import roleNames from '../dialog/roleNames.js';
/** Настройка сцены: кто говорит (роли сцены и их голоса), «кто вы» (слушать или сыграть роль), показ перевода; «Начать». */
export default async function dialogRoles(d) {
  const roles = rolesOf(d.lines), names = await roleNames(d, true);
  const list = roles.map(r => `<div class="role"><b>${DIALOG.marks[r]}</b> ${esc(names[r])}${r === d.you ? ' — ваша реплика' : ''}</div>`).join('');
  const who = row([0, ...roles].map(r => button({ act: 'dialogRole', cls: r === d.you ? 'on' : '', label: r ? `Роль ${r}` : 'Слушаю', data: { r } })).join(''), 'seg who');
  return `<div class="muted note">${d.lines.length} реплик · ${esc(d.lang)}</div>${settingRow('Роли и голоса', list, 'Голоса ролей 1 и 2 выбираются в настройках → «Голос»')}` +
    settingRow('Кто вы?', who, d.you ? 'Ваши реплики не озвучиваются: прочитайте или скажите их — приложение оценит' : 'Вы только слушаете: все роли озвучены') +
    settingRow('Перевод под репликами', prefControl('dialogTr')) + row(button({ act: 'dialogStart', cls: 'p wide', label: '▶ Начать' }), 'nav-row');
}
