import esc from '../util/esc.js';
import avatar from './avatar.js';
export default function navItem({ act, id, title, sub, badge = 0, avatarText = '' }) {
  const pill = badge ? `<span class="badge">${badge}</span>` : '';
  return `<div class="item" data-act="${act}" data-id="${id}">${avatarText ? avatar(avatarText) : ''}` +
    `<div class="t">${esc(title)}<small>${esc(sub)}</small></div>${pill}<span class="chev">›</span></div>`;
}
