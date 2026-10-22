import esc from '../util/esc.js';
import { state } from '../state/appState.js';
import button from './button.js';
import row from './row.js';
import settingRow from './settingRow.js';
import voiceLabel from '../tts/voiceLabel.js';
import resolveVoice from '../tts/resolveVoice.js';
/** Строка выбора голоса: язык озвучки + слот (роль), список голосов (voices — уже отфильтрованы) и «▶» для пробы. */
export default function voiceRow(lang, speaker, voices) {
  const cur = resolveVoice(lang, speaker.slot), data = ` data-lang="${esc(lang)}" data-slot="${speaker.slot}"`;
  const opts = [['', 'По умолчанию (системный)'], ...voices.map(v => [v.name, voiceLabel(v)])]
    .map(([v, l]) => `<option value="${esc(v)}"${v === cur ? ' selected' : ''}>${esc(l)}</option>`).join('');
  const sel = `<select data-act="setVoice" data-on="change"${data}>${opts}</select>`;
  return settingRow(`${speaker.title} · ${lang}`, row(sel + button({ act: 'testVoice', cls: 'icon', label: '▶', aria: 'Проба голоса', data: { lang, slot: speaker.slot } }), 'vrow'),
    voices.length ? '' : 'Для этого языка на устройстве нет голосов — установите их в настройках Android: «Синтез речи»');
}
