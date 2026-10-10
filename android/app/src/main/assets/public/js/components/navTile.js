import esc from '../util/esc.js';
import avatar from './avatar.js';
/** Плитка для режима «Сетка». Без avatarText — компактная мини-карточка (слово + перевод). */
export default function navTile({ act, id, title, sub, badge = 0, avatarText = '' }) {
  const pill = badge ? `<span class="badge">${badge}</span>` : '';
  const head = avatarText ? avatar(avatarText) : '';
  return `<div class="gtile${avatarText ? '' : ' mini'}" data-act="${act}" data-id="${id}">${pill}${head}` +
    `<div class="gt">${esc(title)}</div><small>${esc(sub)}</small></div>`;
}
