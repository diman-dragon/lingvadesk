import { APP_VERSION } from '../constants/APP_VERSION.js';
import { APP_NAME } from '../constants/APP_NAME.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import button from '../components/button.js';
import logoMark from '../components/logoMark.js';
import pagedList from '../components/pagedList.js';
import prefControl from '../components/prefControl.js';
import settingRow from '../components/settingRow.js';
import settingsGroup from '../components/settingsGroup.js';
import row from '../components/row.js';
/** Настройки — четыре страницы (листаются по кругу), каждая помещается в экран. */
export default async function settingsView() {
  const look = settingRow('Вид библиотеки', prefControl('layout'), 'Проекты, колоды и карточки — списком или сеткой') +
    settingRow('Тема', prefControl('theme'), 'AMOLED — чистый чёрный фон') + settingRow('Размер текста на карточках', prefControl('font')) +
    settingRow('Анимации', prefControl('anim'));
  const study = settingRow('Что показывать первым', prefControl('dir'), 'Сторона карточки, с которой начинается вопрос') +
    settingRow('Автоозвучка', prefControl('autoplay'), 'Произносить слово, когда оно появляется') +
    settingRow('Порядок карточек', prefControl('shuffle'), 'Для «Случайной колоды»') +
    settingRow('Оценка знаний', '<div class="muted">Автоматически: по свайпам, переворотам и времени на карточке</div>');
  const data = settingRow('Резервная копия (.fcbak)', row(button({ act: 'backup', cls: 'p', label: 'Создать' }) + button({ act: 'restore', label: 'Восстановить' })),
    'Перед восстановлением текущая БД сохраняется в защитную копию') +
    settingRow('Прогресс', button({ act: 'resetProgress', cls: 'd', label: 'Сбросить прогресс обучения' }), 'Карточки и колоды останутся');
  const about = settingRow(APP_NAME, `<div class="about"><span class="brand">${logoMark()}</span><div class="muted">Версия ${APP_VERSION}<br>Офлайн-карточки<br>© DataLaw</div></div>`);
  const pages = [['Вид', look], ['Учёба', study], ['Данные', data], ['О нас', about]];
  return header('Настройки', { left: backButton('back'), gear: false }) +
    pagedList(pages.map(([title, rows]) => settingsGroup(title, rows)), { fixed: true, titles: pages.map(p => p[0]) });
}
