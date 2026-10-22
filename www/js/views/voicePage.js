import { SPEAKERS } from '../constants/SPEAKERS.js';
import listProjects from '../repo/listProjects.js';
import loadVoiceList from '../tts/loadVoiceList.js';
import resolveVoice from '../tts/resolveVoice.js';
import voicesFor from '../tts/voicesFor.js';
import prefControl from '../components/prefControl.js';
import settingRow from '../components/settingRow.js';
import voiceRow from '../components/voiceRow.js';
/** Страница настроек «Голос»: скорость и высота для всех, голос (локальные, женские / мужские) для каждого языка проектов по слотам из SPEAKERS. */
export default async function voicePage() {
  const [projects, list] = await Promise.all([listProjects(), loadVoiceList()]);
  const langs = [...new Set(projects.map(p => p.tts))];
  const tune = settingRow('Скорость речи', prefControl('ttsRate')) + settingRow('Высота голоса', prefControl('ttsPitch'));
  const rows = langs.length ? langs.flatMap(l => SPEAKERS.map(s => voiceRow(l, s, voicesFor(list, l, resolveVoice(l, s.slot))))).join('')
    : settingRow('Голос', '<div class="muted">Добавьте проект — появится выбор голоса для его языка</div>');
  return tune + rows;
}
