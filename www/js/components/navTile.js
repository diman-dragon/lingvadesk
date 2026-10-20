import esc from '../util/esc.js';
import avatar from './avatar.js';
/** Плитка для режима «Сетка». Без avatarText — компактная мини-карточка (слово + перевод). mark и acts — готовый HTML. */
export default function navTile({ act, id, title, sub, mark = '', acts = '', avatarText = '' }) {
  const head = avatarText ? avatar(avatarText) : '';
  return `<div class="gtile${avatarText ? '' : ' mini'}" data-act="${act}" data-id="${id}">${acts}${head}` +
    `<div class="gt">${esc(title)}</div><small>${esc(sub)}</small>${mark}</div>`;
}
