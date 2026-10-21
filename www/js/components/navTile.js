import esc from '../util/esc.js';
import avatar from './avatar.js';
/** Плитка для режима «Сетка». lead — готовый значок вместо буквы. Без avatarText и lead — компактная мини-карточка (слово + перевод). mark и acts — готовый HTML. */
export default function navTile({ act, id, title, sub, mark = '', acts = '', avatarText = '', lead = '' }) {
  const head = lead || (avatarText ? avatar(avatarText) : '');
  return `<div class="gtile${head ? '' : ' mini'}" data-act="${act}" data-id="${id}">${acts}${head}` +
    `<div class="gt">${esc(title)}</div><small>${esc(sub)}</small>${mark}</div>`;
}
