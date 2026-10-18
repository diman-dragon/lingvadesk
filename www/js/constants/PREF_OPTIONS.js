const ONOFF = [['on', 'Вкл'], ['off', 'Выкл']];
export const PREF_OPTIONS = {
  theme: [['auto', 'Системная'], ['light', 'Светлая'], ['dark', 'AMOLED']],
  font: [['s', 'Мелкий'], ['m', 'Средний'], ['l', 'Крупный']],
  anim: ONOFF,
  haptic: ONOFF,
  autoplay: [['off', 'Выкл'], ['on', 'Вкл']],
  dir: [['fwd', 'Я → П'], ['rev', 'П → Я'], ['mix', 'Вперемешку']],
  check: [['flip', 'Переворот'], ['choice', 'Выбор'], ['type', 'Ввод']],
  newPerDay: [['5', '5'], ['10', '10'], ['20', '20'], ['50', '50']],
  sessionMax: [['20', '20'], ['50', '50'], ['100', '100'], ['9999', 'Все']],
  layout: [['list', 'Список'], ['grid', 'Сетка']],
  mode: [['srs', 'Повторение'], ['listen', 'На слух'], ['speak', 'Говорить']]
};
