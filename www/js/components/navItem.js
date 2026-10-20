import esc from '../util/esc.js';
import avatar from './avatar.js';
/** Строка списка. mark (метка учёбы, в строке названия) и acts (карандаш и корзина) — готовый HTML; без acts справа шеврон. */
export default function navItem({ act, id, title, sub, mark = '', acts = '', avatarText = '' }) {
  return `<div class="item" data-act="${act}" data-id="${id}">${avatarText ? avatar(avatarText) : ''}` +
    `<div class="t"><div class="tl"><span class="tn">${esc(title)}</span>${mark}</div><small>${esc(sub)}</small></div>${acts || '<span class="chev">›</span>'}</div>`;
}
