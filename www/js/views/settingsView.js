import { APP_VERSION } from '../constants/APP_VERSION.js';
import { APP_NAME } from '../constants/APP_NAME.js';
import logoMark from '../components/logoMark.js';
import header from '../components/header.js';
import button from '../components/button.js';
import prefControl from '../components/prefControl.js';
import settingRow from '../components/settingRow.js';
import settingsGroup from '../components/settingsGroup.js';
import row from '../components/row.js';
export default async function settingsView() {
  const look = settingRow('Вид библиотеки', prefControl('layout'), 'Курсы, колоды и карточки — списком или сеткой') + settingRow('Тема', prefControl('theme'), 'AMOLED — чистый чёрный фон, экономит батарею') + settingRow('Размер текста на карточках', prefControl('font')) +
    settingRow('Анимации', prefControl('anim'), 'Переворот карточки и переходы между экранами');
  const study = settingRow('Что показывать первым', prefControl('dir'), 'Сторона карточки, с которой начинается вопрос') +
    settingRow('Автоозвучка', prefControl('autoplay'), 'Произносить слово, когда оно появляется');
  const data = settingRow('Резервная копия (.fcbak)', row(button({ act: 'backup', cls: 'p', label: 'Создать' }) + button({ act: 'restore', label: 'Восстановить' })),
    'Перед восстановлением текущая БД сохраняется в защитную копию') +
    settingRow('Прогресс', button({ act: 'resetProgress', cls: 'd', label: 'Сбросить прогресс обучения' }), 'Карточки и колоды останутся');
  const about = settingRow(APP_NAME, `<div class="about"><span class="brand">${logoMark()}</span><div class="muted">Версия ${APP_VERSION}<br>Офлайн-карточки для изучения языков<br>© DataLaw</div></div>`);
  return header('Настройки') + settingsGroup('Внешний вид', look) + settingsGroup('Обучение', study) +
    settingsGroup('Данные', data) + settingsGroup('О приложении', about);
}
