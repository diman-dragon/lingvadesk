import { APP_VERSION } from '../constants/APP_VERSION.js';
import { APP_NAME } from '../constants/APP_NAME.js';
import header from '../components/header.js';
import button from '../components/button.js';
import logoMark from '../components/logoMark.js';
import pagedList from '../components/pagedList.js';
import prefControl from '../components/prefControl.js';
import settingRow from '../components/settingRow.js';
import settingsGroup from '../components/settingsGroup.js';
import row from '../components/row.js';
import voicePage from './voicePage.js';
import langPage from './langPage.js';
/**
 * Настройки — семь страниц (листаются по кругу), каждая помещается в экран. Вид библиотеки (список / сетка) и порядок карточек —
 * не здесь: они переключаются на самих экранах («Библиотека», «Учёба»). Импорт и экспорт библиотеки — на странице «Данные».
 */
export default async function settingsView() {
  const look = settingRow('Тема', prefControl('theme'), 'AMOLED — чистый чёрный фон') + settingRow('Размер текста на карточках', prefControl('font')) +
    settingRow('Анимации', prefControl('anim')) + settingRow('Вибрация', prefControl('haptic'), 'Лёгкий отклик на свайп и переворот');
  const study = settingRow('Что показывать первым', prefControl('dir'), 'Что на лицевой стороне: слово, перевод или по-разному') +
    settingRow('Проверка', prefControl('check'), 'Переворот, выбор из вариантов или ввод ответа') +
    settingRow('Автоозвучка', prefControl('autoplay'), 'Произносить слово, когда оно появляется') +
    settingRow('Голоса и пакеты языков', '<div class="muted">Скачиваются и проверяются на странице «Языки»</div>');
  const limits = settingRow('Новых карточек в день', prefControl('newPerDay'), 'Сколько новых слов добавляет интервальное повторение за день') +
    settingRow('Карточек за сессию', prefControl('sessionMax'), 'Просроченные идут первыми, самые давние — раньше');
  const data = settingRow('Библиотека', row(button({ act: 'importLibrary', label: 'Файл' }) + button({ act: 'importPaste', label: 'Текст' }) + button({ act: 'exportLibrary', label: 'Экспорт' })), 'Импорт: CSV, TSV, TXT, Anki (.txt, .apkg), Quizlet, Excel, JSON; дублей не создаёт') +
    settingRow('Резервная копия (.fcbak)', row(button({ act: 'backup', cls: 'p', label: 'Создать' }) + button({ act: 'restore', label: 'Восстановить' })),
      'Перед восстановлением текущая БД сохраняется в защитную копию') +
    settingRow('Прогресс', button({ act: 'resetProgress', cls: 'd', label: 'Сбросить прогресс обучения' }), 'Карточки и колоды останутся; история повторений очистится');
  const about = settingRow(APP_NAME, `<div class="about"><span class="brand">${logoMark()}</span><div class="muted">Версия ${APP_VERSION}<br>Офлайн-карточки<br>© DataLaw</div></div>`);
  const pages = [['Вид', look], ['Учёба', study], ['Голос', await voicePage()], ['Языки', await langPage()], ['Лимиты', limits], ['Данные', data], ['О нас', about]];
  return header('Настройки') +
    pagedList(pages.map(([title, rows]) => settingsGroup(title, rows)), { fixed: true, titles: pages.map(p => p[0]) });
}
