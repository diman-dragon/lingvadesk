import loadLevel from '../study/loadLevel.js';
/**
 * Сводка на карточке учёбы: всего · изучено · на сегодня (цвет по 4 градациям) и красный «?», когда есть просроченные.
 * Готовый HTML для поля mark.
 */
export default function studyInfo({ total, learned, left, late }) {
  const q = Number(late) ? `<span class="late" title="просрочено: ${late}" aria-label="просрочено ${late}">?</span>` : '';
  return `<span class="sinfo"><span>всего <b>${total}</b></span><span>изучено <b>${learned}</b></span>` +
    `<span class="today lv${loadLevel(left)}">сегодня <b>${left}</b></span>${q}</span>`;
}
