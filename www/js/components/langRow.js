import button from './button.js';
import row from './row.js';
import settingRow from './settingRow.js';
import { SPEECH_STATUS } from '../constants/SPEECH_STATUS.js';
/** Карточка языка на странице «Языки»: голоса (сколько локальных) и пакет распознавания; кнопки — скачать голоса, проверить / скачать пакет. */
export default function langRow(lang, voices, speech) {
  const v = voices ? `🔊 Локальных голосов: ${voices}` : '🔊 Локальных голосов нет — скачайте';
  return settingRow(lang, `<div class="muted">${v}</div><div class="muted">🎤 ${SPEECH_STATUS[speech]}</div>` +
    row(button({ act: 'installVoices', cls: voices ? '' : 'p', label: 'Скачать голоса' }) + button({ act: 'checkSpeechLang', label: speech === 'installed' ? 'Проверить' : 'Скачать пакет', data: { lang } }), 'lang-btns'));
}
