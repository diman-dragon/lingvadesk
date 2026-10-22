import listProjects from '../repo/listProjects.js';
import loadVoiceList from '../tts/loadVoiceList.js';
import voicesFor from '../tts/voicesFor.js';
import speechStatus from '../tts/speechStatus.js';
import button from '../components/button.js';
import langRow from '../components/langRow.js';
import settingRow from '../components/settingRow.js';
/** Страница настроек «Языки»: для каждого языка проектов — локальные голоса и офлайн-пакет распознавания; всё скачивается и проверяется отсюда, без настроек Android. */
export default async function langPage() {
  const [projects, list] = await Promise.all([listProjects(), loadVoiceList()]);
  const langs = [...new Set(projects.map(p => p.tts))], status = await Promise.all(langs.map(speechStatus));
  const rows = langs.length ? langs.map((l, i) => langRow(l, voicesFor(list, l).length, status[i])).join('') : settingRow('Языки', '<div class="muted">Добавьте проект — здесь появятся его языки</div>');
  return rows + settingRow('Список голосов', button({ act: 'refreshVoices', label: 'Обновить' }), 'Обновляется и сам, когда вы возвращаетесь в приложение');
}
