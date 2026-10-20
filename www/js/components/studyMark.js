/** Метка по данным учёбы у проекта / колоды: пора повторять, есть новые или всё в порядке. Готовый HTML (пусто, если карточек нет). */
export default function studyMark({ due = 0, fresh = 0, total = 0 }) {
  if (Number(due)) return `<span class="mark due">повторить ${due}</span>`;
  if (Number(fresh)) return `<span class="mark new">новых ${fresh}</span>`;
  return Number(total) ? '<span class="mark ok">✓ в порядке</span>' : '';
}
